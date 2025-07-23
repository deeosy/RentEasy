import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Slide,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import usePropertyStore from '../store/usePropertyStore';
import axios from 'axios';
import MapComponent from './MapComponent';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function PostAdModal() {
  const [open, setOpen] = useState(false);
  const [useGPS, setUseGPS] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [selectedCoords, setSelectedCoords] = useState({ latitude: 5.6037, longitude: -0.1870 }) // default to Accra
  const { addProperty, user } = usePropertyStore();
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      type: '', // default to empty string
      location: {
        gps: { latitude: 5.6037, longitude: -0.1870 },
        ghanaPostAddress: '',
      },
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset({
      type: '', // Reset to empty string
      location: {
        gps: { latitude: 5.6037, longitude: -0.1870 },
        ghanaPostAddress: '',
      },
    });
  };

  // Load Paystack Inline JS dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setSelectedCoords({ latitude, longitude })
          reset({
            type: '',
            location: {
              gps: { latitude, longitude },
              ghanaPostAddress: '',
            },
          });
        },
        (error) => {
          setSnackbar({ open: true, message: `Failed to get location: ${error.message}`, severity: 'error' });
        }
      );
    } else {
      setSnackbar({ open: true, message: 'Geolocation is not supported by your browser.', severity: 'error' });
    }
  };

  const onSubmit = async (data) => {
    try {
      const files = Array.from(data.images || []);
      const response = await addProperty(
        {
          title: data.title,
          description: data.description,
          price: data.price,
          location: data.location,
          type: data.type,
        },
        files
      );

      if (response.paymentUrl) {
        setPaymentData(response);
        const paystack = window.PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_ce1cc4c19b341a1e3c6d727df814cce938d41512',
          email: user.email,
          amount: response.amount * 100, // Convert to kobo
          ref: response.reference,
          onClose: () => {
            setSnackbar({ open: true, message: 'Payment cancelled.', severity: 'warning' });
          },
          callback: async (transaction) => {
            try {
              await axios.post(
                'https://renteasy-m3ux.onrender.com/api/properties/confirm-payment',
                {
                  reference: transaction.reference,
                  propertyData: response.propertyData,
                },
                { withCredentials: true }
              );
              setSnackbar({ open: true, message: 'Property posted successfully after payment!', severity: 'success' });
              setOpen(false);
              reset();
            } catch (err) {
              setSnackbar({
                open: true,
                message: `Payment confirmation failed: ${err.response?.data?.message || err.message}`,
                severity: 'error',
              });
            }
          },
        });
        paystack.openIframe();
      } else {
        setSnackbar({ open: true, message: 'Property posted successfully!', severity: 'success' });
        setOpen(false);
        reset();
      }
    } catch (err) {
      setSnackbar({ open: true, message: `Error posting property: ${err.message}`, severity: 'error' });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleMapSelect = (coords) => {
    setSelectedCoords(coords);
    reset({
      type: '',
      location: {
        gps: coords,
        ghanaPostAddress: '',
      }
    })
  };

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        Post Ad
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="post-ad-dialog-description"
      >
        <DialogTitle>Post your property</DialogTitle>
        <DialogContent >
          <div className="py-2">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <TextField
                label="Title"
                {...register('title', { required: 'Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
                fullWidth
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
                fullWidth
              />
              <TextField
                label="Price (GHS per month)"
                type="number"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' },
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                fullWidth
              />
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel>Property Type</InputLabel>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Property type is required' }}
                  render={({ field }) => (
                    <Select {...field} label="Property Type" value={field.value || ''} >
                      <MenuItem value="room">Room</MenuItem>
                      <MenuItem value="building">Building</MenuItem>
                      <MenuItem value="building">Building</MenuItem>
                      <MenuItem value="building">Building</MenuItem>
                    </Select>
                  )}
                />
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
              </FormControl>
              <FormControlLabel
                control={<Checkbox checked={useGPS} onChange={() => setUseGPS(!useGPS)} />}
                label="Use GPS Location"
                className='text-white'
              />
              {useGPS ? (
                <>
                  <Button variant="outlined" onClick={getCurrentLocation}>
                    Get Current Location
                  </Button>
                  <MapComponent onLocationSelect={handleMapSelect} center={[selectedCoords.latitude, selectedCoords.longitude]} />
                  <TextField
                    label="Latitude"
                    type="number"
                    inputProps={{ step: 'any' }}
                    {...register('location.gps.latitude', {
                      required: useGPS ? 'Latitude is required' : false,
                      valueAsNumber: true,
                    })}
                    error={!!errors.location?.gps?.latitude}
                    helperText={errors.location?.gps?.latitude?.message}
                    fullWidth
                  />
                  <TextField
                    label="Longitude"
                    type="number"
                    inputProps={{ step: 'any' }}
                    {...register('location.gps.longitude', {
                      required: useGPS ? 'Longitude is required' : false,
                      valueAsNumber: true,
                    })}
                    error={!!errors.location?.gps?.longitude}
                    helperText={errors.location?.gps?.longitude?.message}
                    fullWidth
                  />
                </>
              ) : (
                <TextField
                  label="Ghana Post Digital Address"
                  {...register('location.ghanaPostAddress', {
                    required: !useGPS ? 'Ghana Post Address is required' : false,
                    pattern: {
                      value: /^[A-Z]{2}-[0-9]{3}-[0-9]{4}$/,
                      message: 'Invalid Ghana Post Address format (e.g., GA-123-4567)',
                    },
                  })}
                  error={!!errors.location?.ghanaPostAddress}
                  helperText={errors.location?.ghanaPostAddress?.message}
                  fullWidth
                />
              )}
              <TextField
                label="Images (max of 5)"
                type="file"
                inputProps={{ multiple: true, accept: 'image/*' }}
                {...register('images', {
                  validate: (files) => files.length <= 5 || 'Maximum 5 images allowed',
                })}
                error={!!errors.images}
                helperText={errors.images?.message}
                fullWidth
              />
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
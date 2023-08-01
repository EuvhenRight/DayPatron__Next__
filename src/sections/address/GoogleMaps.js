import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { Autocomplete, Box, Grid, TextField, Typography } from '@mui/material';

// third-party
import { getGeocode } from 'use-places-autocomplete';
import parse from 'autosuggest-highlight/parse';
import throttle from 'lodash/throttle';

// project import
import { EnvironmentOutlined } from '@ant-design/icons';

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

// ==============================|| GOOGLE MAP - AUTOCOMPLETE ||============================== //

const GoogleMaps = ({ value, setValue, onChange, foundCity, foundStreet, foundStreetNumber, foundAdministrativeAreaLevel1, foundCountry, foundPostCode, foundAddress1, disabled }) => {
  
  const [inputValue, setInputValue] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== 'undefined' && !loaded.current) {
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`,
        document.querySelector('head'),
        'google-maps'
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions({ ...request }, callback);
      }, 200),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="google-maps-autocomplete"
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      fullWidth
      autoHighlight
      includeInputInList
      filterSelectedOptions
      disabled={disabled}
      value={value}
      onChange={(event, newValue) => {
        if (onChange)
          onChange(event, newValue);

        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        let address1 = '';
        getGeocode({ address: newValue?.description })
          .then((results) => {
            results[0].address_components.filter((locData) => {
              
              if (locData.types[0] === 'route') {
                if (locData.long_name !== undefined) address1 = address1 !== '' ? `${locData.long_name} ${address1}` : locData.long_name;
                if (foundStreet)
                  foundStreet(locData);
              }

              if (locData.types[0] === 'street_number') {
                if (locData.long_name !== undefined) address1 = address1 !== '' ? `${address1} ${locData.long_name}` : locData.long_name;
                if (foundStreetNumber)
                  foundStreetNumber(locData);
              }

              if (locData.types[0] === 'locality' || locData.types[0] === 'postal_town') {
                locData.long_name !== undefined && foundCity && foundCity(locData);
              }

              if (locData.types[0] === 'administrative_area_level_1') {
                locData.long_name !== undefined && foundAdministrativeAreaLevel1 && foundAdministrativeAreaLevel1(locData);
              }

              if (locData.types[0] === 'country' && foundCountry) {
                foundCountry(locData);
              }

              if (locData.types[0] === 'postal_code') {
                locData.long_name !== undefined && foundPostCode && foundPostCode(locData);
              }
              return false;
            });
          })
          .then(() => {
            if (foundAddress1)
              foundAddress1(address1);
          });
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} placeholder="Search for an address" fullWidth />}
      renderOption={(props, option) => {
        const matches = option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <li {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <Box component={EnvironmentOutlined} sx={{ color: 'text.secondary', mr: 2 }} />
              </Grid>
              <Grid item xs>
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400
                    }}
                  >
                    {part.text}
                  </span>
                ))}
                <Typography variant="body2" color="text.secondary">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
    />
  );
};

GoogleMaps.propTypes = {
  formik: PropTypes.any,
  disabled: PropTypes.bool
};

export default GoogleMaps;

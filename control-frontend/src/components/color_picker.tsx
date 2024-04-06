import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, color, onChange }) => {
  return (
    <TextField
      label={label}
      type="color"
      value={color}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              sx={{
                width: 20,
                height: 20,
                backgroundColor: color,
                border: '1px solid #ccc',
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{ marginTop: 2, marginBottom: 2, width: 'calc(100% - 24px)' }} // Adjust the width as necessary
    />
  );
};

export default ColorPicker;

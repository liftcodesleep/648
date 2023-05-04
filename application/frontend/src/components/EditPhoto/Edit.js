import { Box } from "@mui/system";
import React from "react";
import { useRef } from "react";

import SliderField from "../SliderField/SliderField";

function Edit() {
  const slider = [
    { label: "Contrast", defaultValue: 100, field: "contrast" },
    { label: "Brightness", defaultValue: 100, field: "brightness" },
    { label: "Saturation", defaultValue: 100, field: "saturate" },
    { label: "Sepia", defaultValue: 0, field: "sepia" },
    { label: "GrayScale", defaultValue: 0, field: "gray" },
  ];

  return (
    <Box
      sx={{
        marginTop: "0.1rem",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "20px",
      }}
    >
      {slider.map((slide) => (
        <SliderField slide={slide} key={slide.field} />
      ))}
    </Box>
  );
}

export default Edit;

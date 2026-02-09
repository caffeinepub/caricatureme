# Specification

## Summary
**Goal:** Align the React caricature generation UI flow with the provided final `index.html`, including the art style picker, status messaging, and PNG download behavior.

**Planned changes:**
- Update the Art Style dropdown to a `select` with `id="styleSelect"` and options that send exactly: `3D Pixar`, `Cyberpunk Neon`, `Pencil Sketch`, `Renaissance Oil`, with visible labels: `3D Pixar Mode`, `Cyberpunk Neon`, `Pencil Sketch`, `Oil Painting`.
- On “Generate My Caricature” click: show inline status text `Processing... (Please wait ~20s)`, clear any previously shown output image, and hide the Download button until success.
- On successful generation: show inline status text `Success!` and reveal a `Download PNG` button that downloads the generated image as `caricature_<timestamp>.png`.
- On generation failure: show inline status text starting with `Error: ` followed by the error message, and keep the Download button hidden.

**User-visible outcome:** Users can select an art style with the specified labels/values, generate a caricature while seeing the exact processing/success/error status text, and download the successful result via a “Download PNG” button with a timestamp-based filename.

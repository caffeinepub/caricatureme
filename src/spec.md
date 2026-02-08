# Specification

## Summary
**Goal:** Replace the text-based input details form with a photo-based upload/camera capture flow for caricature generation, while keeping the existing placeholder generation behavior.

**Planned changes:**
- Update the Input & Payment screen to remove the required fields (Name, Job/Profession, Appearance Description, Art Style) and add a required photo step with options to upload an image or use the device camera when supported.
- Add photo preview and validation so the user cannot proceed to payment without selecting/capturing a valid image, and provide a clear fallback when camera capture is unavailable.
- Update the generation attempt data model and local persistence to store the selected/captured photo across navigation and refresh during an attempt, and clear both photo and result when starting over.
- Adjust the generation trigger to use the photo-based attempt state after successful payment while keeping the existing 3–5 second simulated loading and placeholder result behavior; block generation with a clear error if no photo exists.
- Update the Result screen to remove/hide obsolete metadata fields tied to the removed inputs and optionally show a small thumbnail of the source photo if available.
- Add new user-facing strings for the photo flow to the i18n system without changing existing translation values, with English fallback for missing translations.

**User-visible outcome:** Users can upload a photo or capture one with their camera (when supported), preview it, pay, and then see the generated (placeholder) caricature result; starting a new attempt clears both the previous result and the previously selected/captured photo.

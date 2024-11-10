import { VidedCard } from './client';

## VidedCard Component

The `VidedCard` component is a beautiful and interactive card that displays an image and a video. The video gets activated on hover, providing an engaging user experience.

You can view examples here https://examples.inputron.com/video-cards

### Features

- **Image and Video Display**: Shows an image by default and plays a video on hover.
- **Action Item**: Includes an action item for user interaction.
- **Customizable**: Easily customizable using CSS to fit your design needs.

### Props

The `VidedCard` component accepts the following props:

- `title` (string): The title of the card.
- `description` (string): A brief description displayed on the card.
- `imageUrl` (string): The URL of the image to be displayed.
- `videoUrl` (string): The URL of the video to be played on hover.
- `actionText` (string): The text for the action item.
- `onClick` (function): Callback function to handle the action item click.

### Usage

Here is an example of how to use the `VidedCard` component:

```tsx
import React from 'react';
import { VidedCard } from './client';

const Example = () => {
  const handleAction = () => {
    console.log('Action item clicked');
  };

  return (
    <VidedCard
      title="Sample Video Card"
      description="This is a sample video card description."
      imageUrl="https://example.com/sample-image.jpg"
      videoUrl="https://example.com/sample-video.mp4"
      actionText="Learn More"
      onClick={handleAction}
    />
  );
};

export default Example;
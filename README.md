## Installation

npm install @revivesoft/video-cards

## Add to your react/nextjs projects

import { VidedCard } from '@revivesoft/video-cards';

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
- `variant` (star, circle, chat, cloud, heart, mellow, diamond, flower, hexagon, door, pill, pillRight, saw, square, or house)
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
              variant="flower"
              maskImage={"./images/image1.svg"}
              videoFile={"./videos/autocomplete4.mp4"}
              headerText="FLOWER COVER"
              title="Flower"
              backgroundClass="bg-gradient-to-t from-green-300 to-green-400"
              buttonTextColor="text-green-300"
              sizeClasses="w-full"
              description="Add an artistic flair to your content with a flower shaped ."
              buttonText="GET STARTED"
            />
  );
};

export default Example;


```

### About

The `VidedCard` component was created by [ReviveSoft](https://www.revivesoft.com) to enhance user engagement with interactive media elements.

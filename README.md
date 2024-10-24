# Inputron

Inputron is a powerful package designed to enhance user input experiences in web applications uding Generative AI. It provides a set of customizable building blocks for react/nextjs forms that can be easily integrated into your projects to improve the way users interaction.

## Features

- **Customizable Components**: Easily tailor the appearance and behavior of input components to fit your needs.
- **Enhanced User Experience**: Improve the usability and accessibility of your forms.
- **Seamless Integration**: Quickly integrate Inputron into your existing projects with minimal effort.

## Installation

To install Inputron, use npm or yarn:

```bash
npm install @revivesoft/inputron

```

or

```bash
yarn add @revivesoft/inputron
```

You must obtain an API Key and Client ID from (https://www.inputron.com)

Edit your .env variables to include the API Key and Client ID

```jsx
INPUTRON_API_KEY=ENTER KEY DETAILS HERE
INPUTRON_ENGINE_API_ENDPOINT=https://api.inputron.com
INPUTRON_CLIENT_ID=ENTER YOUR CLIENT ID
```


## 
Here is an example of how to use the `LabelTron` component from the Inputron package:

```jsx
"use client";
import { LabelTron } from "@revivesoft/inputron";

const ExampleLabelComponent = () => {
  return (
    <LabelTron
      languages={['es', 'fr', 'ar']}
      icon={{
        className: "h-3 text-pink-500",
        visible: true,
      }}
      interval={2000}
      className="text-md font-bold"
    >
      First Name
    </LabelTron>
  );
};

export default ExampleLabelComponent;
```



Here is an example of how to use the `Predictron` component from the Inputron package:

```jsx
"use client";
import { Predictron } from "@revivesoft/inputron";
import React, { useState } from 'react';

const ExamplePredictronComponent = () => {
  const [comments, setComments] = useState('');

  const handleChange = (value) => {
    setComments(value);
  };

  return (
    <Predictron
      name='comments'
      onChange={handleChange}
    />
  );
};

export default ExamplePredictronComponent;
```


Here is an example of how to use the `Selectron` component from the Inputron package:

```jsx
"use client";
import { Selectron } from "@revivesoft/inputron";
import React from 'react';

const ExampleSelectronComponent = () => {
  return (
    <Selectron
      style=""
      title="Cool places"
      prompt="5 beaches in miami"
    />
  );
};

export default ExampleSelectronComponent;
```

## Demonstration
For live examples, please visit our [demonstration site](https://www.inputron.com/demo) 

## Documentation

For more detailed documentation and examples, please visit our [official documentation](https://www.inputron.com/docs).

## Contributing

We appreciate your interest, but we are not accepting contributions at this time.

## License

Inputron is licensed under the [MIT License](#).

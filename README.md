# Inputron

Inputron is a powerful package designed to enhance user input experiences in web applications. It provides a set of customizable components that can be easily integrated into your projects to improve the way users interact with forms and other input fields.

## Features

- **Customizable Components**: Easily tailor the appearance and behavior of input components to fit your needs.
- **Enhanced User Experience**: Improve the usability and accessibility of your forms.
- **Seamless Integration**: Quickly integrate Inputron into your existing projects with minimal effort.

## Example Usage


Here is an example of how to use the `TextareaTron` component from the Inputron package:

```jsx
"use client";
import { enhanceAction} from 'inputron/server'
import { TextareaTron } from "inputron/client";
import React, { useState } from 'react';

const ExampleComponent = () => {
  const [explain, setExplain] = useState('');

  return (
    <TextareaTron
      autoFocus
      enhanceAction={enhanceAction}
      id="explaination"
      name="explaination"
      labelConfig={{
        content: "Tell us how it started",
        visible: false,
        style: "text-sm font-semibold text-gray-700",
      }}
      placeholder="Tell us how it started"
      value={explain}
      setTextValue={setExplain}
      prompt='translate to spanish'
      buttonConfiguration={{
        button_visible: false,
        text_visible: true,
        text: "Enhance",
        style: "bg-blue-500 text-xs text-white hover:bg-pink-500 hover:text-black",
      }}
    />
  );
};

export default ExampleComponent;
```

## Installation

To install Inputron, use npm or yarn:

```bash
npm install inputron
```

or

```bash
yarn add inputron
```

You must obtain an API Key and Client ID from (https://www.inputron.com)

Edit your .env variables to include the API Key and Client ID

```jsx
INPUTRON_API_KEY=ENTER KEY DETAILS HERE
INPUTRON_ENGINE_API_ENDPOINT=https://api.inputron.com
INPUTRON_CLIENT_ID=ENTER YOUR CLIENT ID
```



## Documentation

For more detailed documentation and examples, please visit our [official documentation](https://www.inputron.com/docs).

## Contributing

We appreciate your interest, but we are not accepting contributions at this time.

## License

Inputron is licensed under the [MIT License](#).

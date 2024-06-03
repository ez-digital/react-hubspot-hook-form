

# HubSpot Form Component

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/ez-digital/react-hubspot-hook-form.svg)](https://github.com/ez-digital/react-hubspot-hook-form/issues)
[![NPM](https://img.shields.io/npm/v/react-hubspot-hook-form.svg?style=flat-squar)](https://www.npmjs.com/package/@ez-digital/react-hubspot-hook-form)
[![RELEASES](https://img.shields.io/github/release/ez-digital/react-hubspot-hook-form.svg)](https://github.com/ez-digital/react-hubspot-hook-form/releases)
![TypeScript](https://img.shields.io/npm/types/next-hubspot)
[![LINKEDIN](https://img.shields.io/badge/-EZ%20Digital-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/company/ez-digital)


This package provides a React component to integrate and customize HubSpot forms seamlessly. It leverages `react-hook-form` for form handling and validation, allowing you to easily include HubSpot forms in your React applications.

## Features

- Fetches and displays HubSpot forms dynamically based on form ID.
- Customizable form and field styles.
- Client-side validation with `react-hook-form`.
- Handles form submission with HubSpot API integration.
- Displays success and error messages.

## Installation

To install the package, use npm or yarn:

```bash
npm install react-hubspot-hook-form
```

or

```bash
yarn add react-hubspot-hook-form
```

## Pure ESM package

This package is pure ESM. It cannot be `require()`'d from CommonJS.

## Usage

Here's an example of how to use the HubSpotForm component in your React application:

```jsx
import React from "react";
import ReactDOM from "react-dom";

import HubSpotForm from "@ez-digital/react-hubspot-hook-form";
import "@ez-digital/react-hubspot-hook-form/style";

const App = () => {
  return (
    <HubSpotForm
      formId="your-form-id"
      portalId="your-portal-id"
      hubspotApiToken="your-hubspot-api-token"
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

## How to Obtain a HubSpot API Token

To obtain your HubSpot API token, please visit [this link](https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key).

## Props

The `HubSpotForm` component accepts the following props:

| Prop                      | Type                  | Default                                       | Description                                                  |
| ------------------------- | --------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `formId`                  | `string`              | **Required**                                  | HubSpot form ID.                                             |
| `portalId`                | `string`              | **Required**                                  | HubSpot portal ID.                                           |
| `hubspotApiToken`         | `string`              | **Required**                                  | HubSpot API token for authentication.                        |
| `onSubmit`                | `function`            | `undefined`                                   | Custom submit handler function.                              |
| `isSubmitting`            | `boolean`             | `false`                                       | Indicates if the form is currently being submitted.          |
| `isSubmitted`             | `boolean`             | `false`                                       | Indicates if the form has been successfully submitted.       |
| `loader`                  | `ReactNode`           | `undefined`                                   | Custom loader component to display while fetching form data. |
| `skeletonHeight`          | `number`              | `400`                                         | Height of the skeleton loader.                               |
| `successMessage`          | `string`              | `"The form has been submitted successfully."` | Message displayed upon successful form submission.           |
| `errorMessage`            | `string`              | `undefined`                                   | Message displayed upon form submission error.                |
| `formStyles`              | `React.CSSProperties` | `{}`                                          | Custom styles for the form container.                        |
| `formClassName`           | `string`              | `""`                                          | Custom class name for the form container.                    |
| `fieldGroupStyles`        | `React.CSSProperties` | `{}`                                          | Custom styles for the field groups.                          |
| `fieldGroupClassName`     | `string`              | `""`                                          | Custom class name for the field groups.                      |
| `fieldContolStyles`       | `React.CSSProperties` | `{}`                                          | Custom styles for the field controls.                        |
| `fieldContolClassName`    | `string`              | `""`                                          | Custom class name for the field controls.                    |
| `labelStyles`             | `React.CSSProperties` | `{}`                                          | Custom styles for the labels.                                |
| `labelClassName`          | `string`              | `""`                                          | Custom class name for the labels.                            |
| `fieldStyles`             | `React.CSSProperties` | `{}`                                          | Custom styles for the input fields.                          |
| `fieldClassName`          | `string`              | `""`                                          | Custom class name for the input fields.                      |
| `successMessageStyles`    | `React.CSSProperties` | `{}`                                          | Custom styles for the success message.                       |
| `successMessageClassName` | `string`              | `""`                                          | Custom class name for the success message.                   |
| `errorMessageStyles`      | `React.CSSProperties` | `{}`                                          | Custom styles for the error message.                         |
| `errorMessageClassName`   | `string`              | `""`                                          | Custom class name for the error message.                     |
| `buttonStyles`            | `React.CSSProperties` | `{}`                                          | Custom styles for the submit button.                         |
| `buttonClassName`         | `string`              | `""`                                          | Custom class name for the submit button.                     |

## Customization

You can customize the appearance and behavior of the form by passing custom styles and class names for various parts of the form. Additionally, you can provide custom loader components, success messages, and error messages to match the look and feel of your application. Use the provided styles from `@ez-digital/react-hubspot-hook-form/style` or style the form by yourself.

## Example

Here is a more detailed example demonstrating customization:

```jsx
import React from "react";
import ReactDOM from "react-dom";

import HubSpotForm from "@ez-digital/react-hubspot-hook-form";
import "@ez-digital/react-hubspot-hook-form/style";

const customStyles = {
  formStyles: { padding: "20px", backgroundColor: "#f9f9f9" },
  fieldGroupStyles: { marginBottom: "15px" },
  labelStyles: { fontWeight: "bold" },
  fieldStyles: { padding: "10px", borderRadius: "4px" },
  buttonStyles: { backgroundColor: "#007bff", color: "#fff" },
};

const App = () => {
  return (
    <HubSpotForm
      formId="your-form-id"
      portalId="your-portal-id"
      hubspotApiToken="your-hubspot-api-token"
      successMessage="Thank you for your submission!"
      errorMessage="Please correct the errors and try again."
      formStyles={customStyles.formStyles}
      fieldGroupStyles={customStyles.fieldGroupStyles}
      labelStyles={customStyles.labelStyles}
      fieldStyles={customStyles.fieldStyles}
      buttonStyles={customStyles.buttonStyles}
    />
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

## TypeScript

The module is written in TypeScript and type definitions are included.

## Contributing

Contributions, issues and feature requests are welcome!

## Show your support

Give a ⭐️ if you like this project!

## License

This package is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.

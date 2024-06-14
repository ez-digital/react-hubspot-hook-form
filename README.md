# HubSpot Form Component

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/ez-digital/react-hubspot-hook-form.svg)](https://github.com/ez-digital/react-hubspot-hook-form/issues)
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

It's crucial to keep your `PORTAL_ID` and `HUBSPOT_API_TOKEN` secure to prevent unauthorized form submissions and other actions. To achieve this, set up your own server to store these environment variables and handle form requests. Remember, HubSpot mandates that form data requests be submitted from a server, rejecting any client-side requests.

Here's an example of how to use the HubSpotForm component in your React application:

```tsx
// App.tsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

import HubSpotForm, { FieldGroup } from "@ez-digital/react-hubspot-hook-form";
import "@ez-digital/react-hubspot-hook-form/style";

const App = () => {
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>([]);
  const [submitButtonText, setSubmitButtonText] = useState("");
  const [isFormLoading, setFormLoading] = useState(false);
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/getHubSpotForm?formId=${process.env.REACT_APP_CONTACTFORMID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        setFieldGroups(data?.fieldGroups);
        setSubmitButtonText(data?.submitButtonText);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
     .finally(() => setFormLoading(false));
  }, [formId]);

  const onSubmit = async (fields: FieldValues) => {
    setFormSubmitting(true);

    const formattedFields = [];

    for (const [fieldName, fieldValue] of Object.entries(fields) as [
      string,
      string | { label: string; value: string }
    ][]) {
      if (Array.isArray(fieldValue)) {
        formattedFields.push({
          name: fieldName,
          value: fieldValue.join("; "),
        });
      } else if (typeof fieldValue === "object") {
        formattedFields.push({
          name: fieldName,
          value: fieldValue?.label || "",
        });
      } else {
        formattedFields.push({ name: fieldName, value: fieldValue || "" });
      }
    }

    try {
      const response = fetch("http://localhost:8888/api/postHubSpotForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formId: env.REACT_APP_CONTACTFORMID, fields: formattedFields }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      setFormSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  return <HubSpotForm fieldGroups={fieldGroups} submitButtonText={submitButtonText} isLoading={isFormLoading} onSubmit={onSubmit} isSubmitting={isFormSubmitting} isSubmitted={isFormSubmitted} successMessage="The form has been submitted successfully." />;
};

ReactDOM.render(<App />, document.getElementById("root"));
```

```js
// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8888;

app.use(bodyParser.json());

app.get("/api/getHubSpotForm", async (req, res) => {
  const { formId } = req.query;

  try {
    const response = await axios.get(
      `https://api.hubapi.com/marketing/v3/forms/${formId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_API_TOKEN}`,
        },
      }
    );

    res.json({
      fieldGroups: response?.data?.fieldGroups || [],
      submitButtonText: response?.data?.displayOptions?.submitButtonText || "",
    });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).send("Failed to fetch form");
  }
});

app.post("/api/postHubSpotForm", async (req, res) => {
  const { formId, fields } = req.body;

  try {
    const response = await axios.post(
      `https://api.hsforms.com/submissions/v3/integration/submit/${process.env.PORTAL_ID}/${formId}`,
      {
        fields,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).send("Failed to submit form");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## Next.js Integration

For Next.js applications, you can create a utility function to fetch HubSpot form data server-side.

```tsx
// page.tsx
import ContactForm from "./ContactForm";

import { getHubSpotForm } from "./actions";

import env from "./env";

export default async function Page() {
  const formData = await getHubSpotForm(
    env.CONTACTFORMID,
    env.HUBSPOT_API_TOKEN
  );
  return <ContactForm {...formData} />;
}
```

```tsx
// ContactForm.tsx
"use client";

import { useEffect, useTransition } from "react";
import { useFormState } from "react-dom";

import { SubmitHandler, FieldValues } from "react-hook-form";

import HubSpotForm, { FieldGroup } from "@ez-digital/react-hubspot-hook-form";
import "@ez-digital/react-hubspot-hook-form/style";

import { ContactFormSubmit } from "./actions";

export type State = {
  status: "success" | "error";
  message?: string;
} | null;

const ContactForm = ({
  fieldGroups,
  submitButtonText,
}: {
  fieldGroups: FieldGroup[];
  submitButtonText: string;
}) => {
  const [isSubmitting, startTransition] = useTransition();

  const [message, formAction] = useFormState<State, FieldValues>(
    ContactFormSubmit,
    null
  );

  useEffect(() => {
    if (message?.status === "success") {
      console.log("form submitted successfully");
    }
  }, [message]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    startTransition(() => {
      formAction(data);
    });
  };

  return (
    <HubSpotForm
      fieldGroups={fieldGroups}
      submitButtonText={submitButtonText}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isSubmitted={message?.status === "success"}
      successMessage="The form has been submitted successfully."
    />
  );
};

export default ContactForm;
```

```ts
// actions.ts
"use server";

import { FieldGroup, FieldValues } from "@ez-digital/react-hubspot-hook-form";

import { State } from "./ContactForm";

import env from "./env";

type HubSpotFormResponse = {
  fieldGroups: FieldGroup[];
  submitButtonText: string;
};

export async function getHubSpotForm(
  formId: string,
  hubspotApiToken: string
): Promise<HubSpotFormResponse> {
  try {
    const res = await fetch(
      `https://api.hubapi.com/marketing/v3/forms/${formId}`,
      {
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${hubspotApiToken}`,
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    return {
      fieldGroups: data?.fieldGroups || [],
      submitButtonText: data?.displayOptions?.submitButtonText || "",
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      throw new Error(error.message);
    } else {
      console.error(error);
      throw new Error("An unknown error occurred.");
    }
  }
}

export async function ContactFormSubmit(
  currentState: State,
  formData: FieldValues
): Promise<State> {
  const formattedFields = [];

  for (const [fieldName, fieldValue] of Object.entries(formData) as [
    string,
    string | { label: string; value: string }
  ][]) {
    if (Array.isArray(fieldValue)) {
      formattedFields.push({
        name: fieldName,
        value: fieldValue.join("; "),
      });
    } else if (typeof fieldValue === "object") {
      formattedFields.push({
        name: fieldName,
        value: fieldValue?.label || "",
      });
    } else {
      formattedFields.push({ name: fieldName, value: fieldValue || "" });
    }
  }

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${env.PORTALID}/${env.CONTACTFORMID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: formattedFields,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        status: "error",
        message: errorData.message || "Submission failed",
      };
    }

    return { status: "success" };
  } catch (error: any) {
    console.log(error);
    return { status: "error", message: error.message || "Unexpected error" };
  }
}
```

```ts
// env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
  client: {},
  server: {
    HUBSPOT_API_TOKEN: z.string(),
    PORTALID: z.string(),
    CONTACTFORMID: z.string(),
  },
  runtimeEnv: {
    // Server
    HUBSPOT_API_TOKEN: process.env.HUBSPOT_API_TOKEN,
    PORTALID: process.env.PORTALID,
    CONTACTFORMID: process.env.CONTACTFORMID,
  },
});

export default env;
```

```makefile
# env
PORTALID=YOUR_PORTALID
CONTACTFORMID=YOUR_CONTACTFORMID
HUBSPOT_API_TOKEN=YOUR_HUBSPOT_API_TOKEN
```

## How to Obtain a HubSpot API Token

To obtain your HubSpot API token, please visit [this link](https://knowledge.hubspot.com/integrations/how-do-i-get-my-hubspot-api-key).

## Props

The `HubSpotForm` component accepts the following props:

Here's the updated table and corresponding documentation:

### Table

| Prop                      | Type                  | Default                                       | Description                                                  |
| ------------------------- | --------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `fieldGroups`             | `FieldGroup[]`        | **Required**                                  | An array of field groups to be displayed in the form.        |
| `submitButtonText`        | `string`              | **Required**                                  | The text to display on the submit button.                    |
| `onSubmit`                | `SubmitHandler<T>`    | **Required**                                  | The form submit handler function.                            |
| `isLoading`               | `boolean`             | `false`                                       | Indicates if the form is currently loading data.             |
| `isSubmitting`            | `boolean`             | `false`                                       | Indicates if the form is currently being submitted.          |
| `isSubmitted`             | `boolean`             | `false`                                       | Indicates if the form has been successfully submitted.       |
| `loader`                  | `ReactNode`           | `Custom loader`                               | Custom loader component to display while fetching form data. |
| `skeletonHeight`          | `number \| string`    | `400`                                         | Height of the skeleton loader.                               |
| `successMessage`          | `string`              | `"The form has been submitted successfully."` | Message displayed upon successful form submission.           |
| `errorMessage`            | `string`              | `undefined`                                   | Message displayed upon form submission error.                |
| `formStyles`              | `React.CSSProperties` | `{}`                                          | Custom styles for the form container.                        |
| `formClassName`           | `string`              | `""`                                          | Custom class name for the form container.                    |
| `fieldGroupStyles`        | `React.CSSProperties` | `{}`                                          | Custom styles for the field groups.                          |
| `fieldGroupClassName`     | `string`              | `""`                                          | Custom class name for the field groups.                      |
| `fieldControlStyles`      | `React.CSSProperties` | `{}`                                          | Custom styles for the field controls.                        |
| `fieldControlClassName`   | `string`              | `""`                                          | Custom class name for the field controls.                    |
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

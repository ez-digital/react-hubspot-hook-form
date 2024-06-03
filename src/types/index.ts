import { CSSProperties, ReactNode } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

/**
 * Represents a single form field.
 * @interface
 */
export default interface Field {
  /** The type of the field. */
  fieldType: string;
  /** Indicates whether the field is hidden. */
  hidden: boolean;
  /** The label for the field. */
  label: string;
  /** The name of the field. */
  name: string;
  /** The ID of the object type. */
  objectTypeId: string;
  /** Indicates whether the field is required. */
  required: boolean;
  /** The placeholder text for the field. */
  placeholder: string;
  /** The default value for the field. */
  defaultValue: string;
  /** The default values for the field. */
  defaultValues: string[];
  /** The options for select fields. */
  options: { label: string; value: string }[];
}

/**
 * Represents a group of fields or rich text.
 * @property {string} groupType - The type of the field group.
 * @property {string} richTextType - The type of rich text.
 * @property {Field[]} [fields] - The array of fields if the group contains fields.
 * @property {string} [richText] - The rich text content if the group contains rich text.
 */
export type FieldGroup = (
  | {
      fields: Field[];
    }
  | {
      richText: string;
    }
) & {
  groupType: string;
  richTextType: string;
};

/**
 * Represents the props related to form submission.
 * @property {string | number} [portalId] - The portal ID for the form submission.
 * @property {SubmitHandler<T>} [onSubmit] - The form submit handler.
 * @template T
 */
type FormSubmissionProps<T extends FieldValues> =
  | {
      /** The portal ID for the form submission. */
      portalId: string | number;
      /** The form submit handler. */
      onSubmit?: never;
    }
  | {
      onSubmit: SubmitHandler<T>;
      /** The portal ID for the form submission. */
      portalId?: never;
    };

/**
 * Represents the props for the form component.
 * @property {string | number} hubspotApiToken - The HubSpot API token.
 * @property {string | number} formId - The ID of the form.
 * @property {boolean} [isSubmitting] - Indicates whether the form is currently submitting.
 * @property {boolean} [isSubmitted] - Indicates whether the form has been submitted.
 * @property {ReactNode} [loader] - The loader component.
 * @property {number | "string"} [skeletonHeight] - The height of the skeleton loader.
 * @property {string} [successMessage] - The success message to display after form submission.
 * @property {string} [errorMessage] - The error message to display if form submission fails.
 * @property {string} [formClassName] - The CSS class for the form.
 * @property {CSSProperties} [formStyles] - Inline styles for the form.
 * @property {CSSProperties} [fieldGroupStyles] - Inline styles for the field group.
 * @property {string} [fieldGroupClassName] - The CSS class for the field group.
 * @property {CSSProperties} [fieldContolStyles] - Inline styles for the field control.
 * @property {string} [fieldContolClassName] - The CSS class for the field control.
 * @property {CSSProperties} [labelStyles] - Inline styles for the label.
 * @property {string} [labelClassName] - The CSS class for the label.
 * @property {CSSProperties} [fieldStyles] - Inline styles for the field.
 * @property {string} [fieldClassName] - The CSS class for the field.
 * @property {CSSProperties} [successMessageStyles] - Inline styles for the success message.
 * @property {string} [successMessageClassName] - The CSS class for the success message.
 * @property {CSSProperties} [errorMessageStyles] - Inline styles for the error message.
 * @property {string} [errorMessageClassName] - The CSS class for the error message.
 * @property {CSSProperties} [buttonStyles] - Inline styles for the button.
 * @property {string} [buttonClassName] - The CSS class for the button.
 */
export type FormProps<T extends FieldValues> = {
  /** The HubSpot API token. */
  hubspotApiToken: string | number;
  /** The ID of the form. */
  formId: string | number;
  /** Indicates whether the form is currently submitting. */
  isSubmitting?: boolean;
  /** Indicates whether the form has been submitted. */
  isSubmitted?: boolean;
  /** The loader component. */
  loader?: ReactNode;
  /** The height of the skeleton loader. */
  skeletonHeight?: number | "string";
  /** The success message to display after form submission. */
  successMessage?: string;
  /** The error message to display if form submission fails. */
  errorMessage?: string;
  /** The CSS class for the form. */
  formClassName?: string;
  /** Inline styles for the form. */
  formStyles?: CSSProperties;
  /** Inline styles for the field group. */
  fieldGroupStyles?: CSSProperties;
  /** The CSS class for the field group. */
  fieldGroupClassName?: string;
  /** Inline styles for the field control. */
  fieldContolStyles?: CSSProperties;
  /** The CSS class for the field control. */
  fieldContolClassName?: string;
  /** Inline styles for the label. */
  labelStyles?: CSSProperties;
  /** The CSS class for the label. */
  labelClassName?: string;
  /** Inline styles for the field. */
  fieldStyles?: CSSProperties;
  /** The CSS class for the field. */
  fieldClassName?: string;
  /** Inline styles for the success message. */
  successMessageStyles?: CSSProperties;
  /** The CSS class for the success message. */
  successMessageClassName?: string;
  /** Inline styles for the error message. */
  errorMessageStyles?: CSSProperties;
  /** The CSS class for the error message. */
  errorMessageClassName?: string;
  /** Inline styles for the button. */
  buttonStyles?: CSSProperties;
  /** The CSS class for the button. */
  buttonClassName?: string;
} & FormSubmissionProps<T>;

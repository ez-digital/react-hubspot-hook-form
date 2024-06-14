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
 * Represents the props for the form component.
 * @template T - The type of field values.
 * @property {FieldGroup[]} fieldGroups - An array of field groups to be displayed in the form.
 *   Each `FieldGroup` represents a group of form fields.
 * @property {string} submitButtonText - The text to display on the submit button.
 *   This text will be rendered inside the submit button of the form.
 * @property {SubmitHandler<T>} onSubmit - The form submit handler.
 *   This function will be called when the form is submitted.
 * @property {boolean} [isFormLoading] - Indicates whether the form is in a loading state.
 *   If true, a loading indicator will be displayed.
 * @property {boolean} [isSubmitting] - Indicates whether the form is currently submitting.
 *   If true, the form is currently in the process of being submitted.
 * @property {boolean} [isSubmitted] - Indicates whether the form has been submitted.
 *   If true, the form has already been successfully submitted.
 * @property {ReactNode} [loader] - The loader component.
 *   Optional component to display when the form is loading or submitting.
 * @property {number | string} [skeletonHeight] - The height of the skeleton loader.
 *   Height (in pixels or as a CSS string) to use for the skeleton loader.
 * @property {string} [successMessage] - The success message to display after form submission.
 *   Message to show when the form submission is successful.
 * @property {string} [errorMessage] - The error message to display if form submission fails.
 *   Message to show when the form submission fails.
 * @property {string} [formClassName] - The CSS class for the form.
 *   Additional CSS class names to apply to the form element.
 * @property {CSSProperties} [formStyles] - Inline styles for the form.
 *   CSS styles to apply directly to the form element.
 * @property {CSSProperties} [fieldGroupStyles] - Inline styles for the field group.
 *   CSS styles to apply directly to the field group elements.
 * @property {string} [fieldGroupClassName] - The CSS class for the field group.
 *   Additional CSS class names to apply to the field group elements.
 * @property {CSSProperties} [fieldContolStyles] - Inline styles for the field control.
 *   CSS styles to apply directly to the field control elements.
 * @property {string} [fieldContolClassName] - The CSS class for the field control.
 *   Additional CSS class names to apply to the field control elements.
 * @property {CSSProperties} [labelStyles] - Inline styles for the label.
 *   CSS styles to apply directly to the label elements.
 * @property {string} [labelClassName] - The CSS class for the label.
 *   Additional CSS class names to apply to the label elements.
 * @property {CSSProperties} [fieldStyles] - Inline styles for the field.
 *   CSS styles to apply directly to the field elements.
 * @property {string} [fieldClassName] - The CSS class for the field.
 *   Additional CSS class names to apply to the field elements.
 * @property {CSSProperties} [successMessageStyles] - Inline styles for the success message.
 *   CSS styles to apply directly to the success message element.
 * @property {string} [successMessageClassName] - The CSS class for the success message.
 *   Additional CSS class names to apply to the success message element.
 * @property {CSSProperties} [errorMessageStyles] - Inline styles for the error message.
 *   CSS styles to apply directly to the error message element.
 * @property {string} [errorMessageClassName] - The CSS class for the error message.
 *   Additional CSS class names to apply to the error message element.
 * @property {CSSProperties} [buttonStyles] - Inline styles for the button.
 *   CSS styles to apply directly to the submit button element.
 * @property {string} [buttonClassName] - The CSS class for the button.
 *   Additional CSS class names to apply to the submit button element.
 */
export type FormProps<T extends FieldValues> = {
  /**
   * An array of field groups to be displayed in the form.
   * Each `FieldGroup` represents a group of form fields.
   */
  fieldGroups: FieldGroup[];
  /**
   * The text to display on the submit button.
   * This text will be rendered inside the submit button of the form.
   */
  submitButtonText: string;
  /**
   * The form submit handler.
   * This function will be called when the form is submitted.
   */
  onSubmit: SubmitHandler<T>;
  /**
   * Indicates whether the form is currently loading data.
   * If true, a loading indicator will be displayed.
   */
  isLoading?: boolean;
  /**
   * Indicates whether the form is currently submitting.
   * If true, the form is currently in the process of being submitted.
   */
  isSubmitting?: boolean;
  /**
   * Indicates whether the form has been submitted.
   * If true, the form has already been successfully submitted.
   */
  isSubmitted?: boolean;
  /**
   * The loader component.
   * Optional component to display when the form is loading or submitting.
   */
  loader?: ReactNode;
  /**
   * The height of the skeleton loader.
   * Height (in pixels or as a CSS string) to use for the skeleton loader.
   */
  skeletonHeight?: number | string;
  /**
   * The success message to display after form submission.
   * Message to show when the form submission is successful.
   */
  successMessage?: string;
  /**
   * The error message to display if form submission fails.
   * Message to show when the form submission fails.
   */
  errorMessage?: string;
  /**
   * The CSS class for the form.
   * Additional CSS class names to apply to the form element.
   */
  formClassName?: string;
  /**
   * Inline styles for the form.
   * CSS styles to apply directly to the form element.
   */
  formStyles?: CSSProperties;
  /**
   * Inline styles for the field group.
   * CSS styles to apply directly to the field group elements.
   */
  fieldGroupStyles?: CSSProperties;
  /**
   * The CSS class for the field group.
   * Additional CSS class names to apply to the field group elements.
   */
  fieldGroupClassName?: string;
  /**
   * Inline styles for the field control.
   * CSS styles to apply directly to the field control elements.
   */
  fieldContolStyles?: CSSProperties;
  /**
   * The CSS class for the field control.
   * Additional CSS class names to apply to the field control elements.
   */
  fieldContolClassName?: string;
  /**
   * Inline styles for the label.
   * CSS styles to apply directly to the label elements.
   */
  labelStyles?: CSSProperties;
  /**
   * The CSS class for the label.
   * Additional CSS class names to apply to the label elements.
   */
  labelClassName?: string;
  /**
   * Inline styles for the field.
   * CSS styles to apply directly to the field elements.
   */
  fieldStyles?: CSSProperties;
  /**
   * The CSS class for the field.
   * Additional CSS class names to apply to the field elements.
   */
  fieldClassName?: string;
  /**
   * Inline styles for the success message.
   * CSS styles to apply directly to the success message element.
   */
  successMessageStyles?: CSSProperties;
  /**
   * The CSS class for the success message.
   * Additional CSS class names to apply to the success message element.
   */
  successMessageClassName?: string;
  /**
   * Inline styles for the error message.
   * CSS styles to apply directly to the error message element.
   */
  errorMessageStyles?: CSSProperties;
  /**
   * The CSS class for the error message.
   * Additional CSS class names to apply to the error message element.
   */
  errorMessageClassName?: string;
  /**
   * Inline styles for the button.
   * CSS styles to apply directly to the submit button element.
   */
  buttonStyles?: CSSProperties;
  /**
   * The CSS class for the button.
   * Additional CSS class names to apply to the submit button element.
   */
  buttonClassName?: string;
};

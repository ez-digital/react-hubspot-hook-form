import { CSSProperties, ReactNode } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

/**
 * Represents a single form field.
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
 */
export type FormProps<T extends FieldValues> = {
  /**
   * Each `FieldGroup` represents a group of form fields.
   */
  fieldGroups: FieldGroup[];
  /**
   * This text will be rendered inside the submit button of the form.
   */
  submitButtonText: string;
  /**
   * This function will be called when the form is submitted.
   */
  onSubmit: SubmitHandler<T>;
  /**
   * If true, a loading indicator will be displayed.
   */
  isLoading?: boolean;
  /**
   * If true, the form is currently in the process of being submitted.
   */
  isSubmitting?: boolean;
  /**
   * If true, the form has already been successfully submitted.
   */
  isSubmitted?: boolean;
  /**
   * Optional component to display when the form is loading or submitting.
   */
  loader?: ReactNode;
  /**
   * Height (in pixels or as a CSS string) to use for the skeleton loader.
   */
  skeletonHeight?: number | string;
  /**
   * Message to show when the form submission is successful.
   */
  successMessage?: string | ReactNode;
  /**
   * Message to show when the form submission fails.
   */
  errorMessage?: string | ReactNode;
  /**
   * Additional CSS class names to apply to the form element.
   */
  formClassName?: string;
  /**
   * CSS styles to apply directly to the form element.
   */
  formStyles?: CSSProperties;
  /**
   * CSS styles to apply directly to the field group elements.
   */
  fieldGroupStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the field group elements.
   */
  fieldGroupClassName?: string;
  /**
   * CSS styles to apply directly to the field control elements.
   */
  fieldContolStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the field control elements.
   */
  fieldContolClassName?: string;
  /**
   * CSS styles to apply directly to the label elements.
   */
  labelStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the label elements.
   */
  labelClassName?: string;
  /**
   * CSS styles to apply directly to the field elements.
   */
  fieldStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the field elements.
   */
  fieldClassName?: string;
  /**
   * CSS styles to apply directly to the success message element.
   */
  successMessageStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the success message element.
   */
  successMessageClassName?: string;
  /**
   * CSS styles to apply directly to the error message element.
   */
  errorMessageStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the error message element.
   */
  errorMessageClassName?: string;
  /**
   * CSS styles to apply directly to the submit button element.
   */
  buttonStyles?: CSSProperties;
  /**
   * Additional CSS class names to apply to the submit button element.
   */
  buttonClassName?: string;
};

"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useForm, Controller, FieldValues, Path } from "react-hook-form";

import { FieldGroup, FormProps } from "../types";

import styles from "./style.module.css";

const parseRichTextToCustomName = (
  group: FieldGroup,
  customStyles?: React.CSSProperties,
  customClassName?: string
) => {
  if ("richText" in group) {
    const match = group.richText.match(/<(h\d|p|span)[^>]*>(.*?)<\/\1>/);
    if (match) {
      const tag = match[1];
      const styles =
        tag === "p" || tag === "span"
          ? { fontSize: "14px" }
          : { fontWeight: "700" };
      return (
        <div
          dangerouslySetInnerHTML={{ __html: group.richText }}
          style={{ ...styles, ...customStyles }}
          className={customClassName}
        />
      );
    }
  }
};

export default function HubSpotForm<T extends FieldValues>({
  fieldGroups,
  submitButtonText,
  onSubmit,
  isLoading,
  isSubmitting,
  isSubmitted,
  loader,
  skeletonHeight = 400,
  successMessage = "The form has been submitted successfully.",
  errorMessage,
  formStyles = {},
  formClassName = "",
  fieldGroupStyles = {},
  fieldGroupClassName = "",
  fieldContolStyles = {},
  fieldContolClassName = "",
  labelStyles = {},
  labelClassName = "",
  fieldStyles = {},
  fieldClassName = "",
  successMessageStyles = {},
  successMessageClassName = "",
  errorMessageStyles = {},
  errorMessageClassName = "",
  buttonStyles = {},
  buttonClassName = "",
}: FormProps<T>) {
  const [isFormSubmitted, setFormSubmitted] = useState(false);
  const [isTouched, setIsTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFormSubmitted(isSubmitted || false);
  }, [isSubmitted]);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    trigger,
  } = useForm<T>();

  const handleBlurValidation = async (name: string, onBlur?: () => void) => {
    await trigger(name as Path<T>); // Trigger validation for the specified input field
    if (onBlur) onBlur(); // Call the original onBlur handler if provided
    setIsTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleChangeValidation = (name: string) => {
    setIsTouched((prev) => ({ ...prev, [name]: true }));
  };

  const onInvalidSubmit = async () => {
    // Mark all required fields as touched
    const newTouched: Record<string, boolean> = {};
    fieldGroups.forEach((group) => {
      "fields" in group &&
        group.fields?.forEach((field) => {
          if (field.required) {
            newTouched[field.name] = true;
          }
        });
    });
    setIsTouched((prev) => ({ ...prev, ...newTouched }));
  };

  if (isLoading) {
    return loader ? (
      <>{loader}</>
    ) : (
      <div
        className={`${styles["rhhf-skeleton"]}`}
        style={{ height: skeletonHeight }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalidSubmit)}
      className={`rhhf-form ${formClassName}`.trim()}
      style={formStyles}
    >
      {fieldGroups?.map((group, groupIndex) => (
        <div
          key={groupIndex}
          style={fieldGroupStyles}
          className={`rhhf-group ${styles["rhhf-group"]} ${fieldGroupClassName}`.trim()}
        >
          {"fields" in group
            ? group?.fields?.map((field, fieldIndex) => {
                const commonProps = {
                  style: fieldStyles,
                  id: field?.name,
                  hidden: field?.hidden,
                  placeholder: field?.placeholder,
                  defaultValue:
                    field.defaultValue !== undefined
                      ? field.defaultValue
                      : field.defaultValues?.length
                      ? field.defaultValues[0]
                      : "",
                  className: [
                    "rhhf-field",
                    styles["rhhf-field"],
                    fieldClassName,
                    isTouched[field?.name] &&
                      (errors[field?.name] ? "invalid" : "valid"),
                    isTouched[field?.name] &&
                      (errors[field?.name] ? styles["rhhf-field-invalid"] : {}),
                  ]
                    .filter(Boolean)
                    .join(" ")
                    .trim(),
                  ...register(field?.name as Path<T>, {
                    required: field?.required
                      ? `This field is required`
                      : false,
                    pattern:
                      field?.fieldType === "email"
                        ? {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                            message: `Valid email is required`,
                          }
                        : field?.fieldType === "phone"
                        ? {
                            value: /^[0-9]{10}$/,
                            message: `Valid phone number is required`,
                          }
                        : undefined,
                  }),
                };

                return (
                  <div
                    key={fieldIndex}
                    style={fieldContolStyles}
                    className={`rhhf-control ${styles["rhhf-control"]} ${
                      field.hidden ? styles["rhhf-control-hidden"] : ""
                    } ${fieldContolClassName}`.trim()}
                  >
                    {!field?.hidden &&
                      field?.fieldType !== "single_checkbox" && (
                        <label
                          htmlFor={field?.name}
                          className={`rhhf-label ${styles["rhhf-label"]} ${labelClassName}`.trim()}
                          style={labelStyles}
                        >
                          {field?.label}
                          {field?.required && (
                            <span style={{ color: "red", marginLeft: "2px" }}>
                              *
                            </span>
                          )}
                        </label>
                      )}
                    <Controller
                      name={field?.name as Path<T>}
                      control={control}
                      render={(renderProps) => {
                        switch (field.fieldType) {
                          case "single_line_text":
                          case "email":
                          case "phone":
                          case "number":
                            return (
                              <input
                                type={
                                  field.fieldType === "single_line_text"
                                    ? "text"
                                    : field.fieldType
                                }
                                {...commonProps}
                                onChange={(e) => {
                                  handleChangeValidation(field.name);
                                  renderProps.field.onChange(e);
                                }}
                                onBlur={() =>
                                  handleBlurValidation(
                                    field.name,
                                    renderProps.field.onBlur
                                  )
                                }
                              />
                            );
                          case "multi_line_text":
                            return (
                              <textarea
                                {...commonProps}
                                onChange={(e) => {
                                  handleChangeValidation(field.name);
                                  renderProps.field.onChange(e);
                                }}
                                onBlur={() =>
                                  handleBlurValidation(
                                    field?.name,
                                    renderProps.field.onBlur
                                  )
                                }
                              />
                            );
                          case "dropdown":
                            return (
                              <select
                                {...commonProps}
                                onChange={(e) => {
                                  handleChangeValidation(field.name);
                                  renderProps.field.onChange(e);
                                }}
                                onBlur={() =>
                                  handleBlurValidation(
                                    field?.name,
                                    renderProps.field.onBlur
                                  )
                                }
                              >
                                <option value="" disabled>
                                  {field.placeholder || "Select"}
                                </option>
                                {field?.options?.map((option, idx) => (
                                  <option
                                    key={`option${idx}`}
                                    value={option?.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            );
                          case "single_checkbox":
                            return (
                              <>
                                <label
                                  htmlFor={field.name}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 10,
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    defaultChecked={
                                      field.defaultValue === "true"
                                    }
                                    {...commonProps}
                                    onChange={(e) => {
                                      handleChangeValidation(field.name);
                                      renderProps.field.onChange(e);
                                    }}
                                    onBlur={() =>
                                      handleBlurValidation(
                                        field?.name,
                                        renderProps.field.onBlur
                                      )
                                    }
                                  />
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: field?.label,
                                    }}
                                  />
                                  {field?.required && (
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "3px",
                                      }}
                                    >
                                      *
                                    </span>
                                  )}
                                </label>
                              </>
                            );
                          case "radio":
                            return (
                              <div
                                className={`rhhf-radio-group ${styles["rhhf-radio-group"]}`}
                              >
                                {field?.options?.map((opt, idx) => {
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  const { defaultValue, ...rest } = commonProps;
                                  return (
                                    <label key={`opt${idx}`}>
                                      <input
                                        type="radio"
                                        {...rest}
                                        value={opt?.value}
                                        defaultChecked={field?.defaultValues?.includes(
                                          opt?.value
                                        )}
                                      />
                                      {opt?.label}
                                    </label>
                                  );
                                })}
                              </div>
                            );
                          case "multiple_checkboxes":
                            return (
                              <div
                                className={`rhhf-checkbox-group ${styles["rhhf-checkbox-group"]}`}
                              >
                                {field?.options?.map((opt, idx) => {
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  const { defaultValue, ...rest } = commonProps;
                                  return (
                                    <label key={`opt${idx}`}>
                                      <input
                                        type="checkbox"
                                        {...rest}
                                        value={opt?.value}
                                        defaultChecked={field?.defaultValues?.includes(
                                          opt?.value
                                        )}
                                      />
                                      {opt?.label}
                                    </label>
                                  );
                                })}
                              </div>
                            );
                          default:
                            return <></>;
                        }
                      }}
                    />
                    {!field?.hidden && (
                      <p
                        style={errorMessageStyles}
                        className={`rhhf-error ${styles["rhhf-error"]} ${errorMessageClassName}`.trim()}
                      >
                        {errors[field?.name] &&
                        field?.fieldType === "single_checkbox"
                          ? "This field is required"
                          : (errors[field?.name]?.message as ReactNode)}
                      </p>
                    )}
                  </div>
                );
              })
            : parseRichTextToCustomName(group)}
        </div>
      ))}
      {Object.keys(errors).length === 0 && errorMessage && (
        <p
          style={errorMessageStyles}
          className={`rhhf-error-message ${styles["rhhf-error-message"]} ${errorMessageClassName}`.trim()}
        >
          {errorMessage}
        </p>
      )}
      {isFormSubmitted && (
        <p
          style={successMessageStyles}
          className={`rhhf-success-message  ${styles["rhhf-success-message"]} ${successMessageClassName}`.trim()}
        >
          {successMessage}
        </p>
      )}
      {submitButtonText && (
        <button
          disabled={isSubmitting}
          type="submit"
          style={buttonStyles}
          className={`rhhf-button ${styles["rhhf-button"]} ${buttonClassName}`.trim()}
        >
          {submitButtonText}
        </button>
      )}
    </form>
  );
}

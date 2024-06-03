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
  formId,
  portalId,
  hubspotApiToken,
  onSubmit,
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
  const [fieldGroups, setFieldGroups] = useState<FieldGroup[]>([]);
  const [submitButtonText, setSubmitButtonText] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [isFormSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const getFormData = async () => {
      try {
        const res = await fetch(
          `https://api.hubapi.com/marketing/v3/forms/${formId}`,
          {
            headers: {
              Authorization: `Bearer ${hubspotApiToken}`,
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFieldGroups(data?.fieldGroups || []);
        setSubmitButtonText(data?.displayOptions?.submitButtonText || "");
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    };
    getFormData();
  }, [formId]);

  useEffect(() => {
    setFormSubmitting(isSubmitting || false);
  }, [isSubmitting]);

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

  // Function to handle onBlur event and trigger validation
  const handleBlurValidation = async (name: string, onBlur?: () => void) => {
    await trigger(name as Path<T>); // Trigger validation for the specified input field
    if (onBlur) onBlur(); // Call the original onBlur handler if provided
  };

  const onCustomSubmit = async (fields: FieldValues) => {
    setFormSubmitting(true);
    const formattedFields = [];

    for (const [fieldName, fieldValue] of Object.entries(fields) as [
      string,
      string | { label: string; value: string }
    ][]) {
      if (typeof fieldValue === "object") {
        formattedFields.push({ name: fieldName, value: fieldValue.label });
      } else {
        formattedFields.push({ name: fieldName, value: fieldValue });
      }
    }

    try {
      const response = await fetch(
        `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context: {
              pageUri: window.location.href, // Extract page URI from window
            },
            fields: formattedFields,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }

      setFormSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        // Handle unexpected error types here
        console.error(error);
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (isLoading) {
    return loader ? (
      <>{loader}</>
    ) : (
      <div className="skeleton" style={{ height: skeletonHeight }} />
    );
  }

  return (
    <form
      onSubmit={
        onSubmit && !portalId
          ? handleSubmit(onSubmit)
          : handleSubmit(onCustomSubmit)
      }
      className={`rhhf-form ${styles["rhhf-form"]} ${formClassName}`.trim()}
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
                  className:
                    `rhhf-field ${styles["rhhf-field"]} ${fieldClassName}`.trim(),
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
                      field.hidden ? "hidden" : ""
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
                                    value={option.value}
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
          disabled={isFormSubmitting}
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

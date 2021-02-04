/**
 * @description Interface for passing rich presentation model validator options.
 */
interface RichPresentationModelValidatorOptions<T> {
  newValue: T;
}

/**
 * @description Interface for passing rich presentation model comparator
 * options.
 */
interface RichPresentationModelEqualsOptions<T> {
  value: T;
  baseValue: T;
}

/**
 * @description Type representing rich presentation model validor callback.
 */
export type RichPresentationModelValidator<T> = (
  options: RichPresentationModelValidatorOptions<T>
) => boolean;

/**
 * @description Type representing rich presentation model comparator callback.
 */
export type RichPresentationModelEquals<T> = (
  options: RichPresentationModelEqualsOptions<T>
) => boolean;

/**
 * @description Interface representing rich presentation model
 * constructor options.
 */
export interface RichPresentationModelConstructorOptions<T> {
  label: string;
  value: T;
  baseValue: T;
  enabled: boolean;
  editable: boolean;
  optional: boolean;
  tooltip: string;
  widgethint: string;
  validator: RichPresentationModelValidator<T>;
  equals: RichPresentationModelEquals<T>;
}

/**
 * @description Interface representing rich presentation model
 * constructor options.
 */
export interface ReactRichPresentationModel<T> {
  uiModel: {
    label: string;
    value: T;
    baseValue: T;
    enabled: boolean;
    editable: boolean;
    optional: boolean;
    tooltip: string;
    widgethint: string;
    valid: boolean;
    dirty: boolean;
  };
  setValue: (newValue: T) => void;
  setBaseValue: (newValue: T) => void;
  setLabel: (newValue: string) => void;
  setEnabled: (newValue: boolean) => void;
  setEditable: (newValue: boolean) => void;
  setOptional: (newValue: boolean) => void;
  setWidgetHint: (newValue: string) => void;
  setValidator: (newValue: RichPresentationModelValidator<T>) => void;
  setEquals: (newValue: RichPresentationModelEquals<T>) => void;
}

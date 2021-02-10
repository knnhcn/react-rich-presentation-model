import { useState } from "react";
import { RichPresentationModel } from "../rich-presentation-model/index";
import {
  RichPresentationModelConstructorOptions,
  ReactRichPresentationModel,
  RichPresentationModelValidator,
  RichPresentationModelEquals,
} from "../interfaces";

type ReactRichPresentationUiModel<T> = Pick<
  RichPresentationModel<T>,
  | "label"
  | "value"
  | "baseValue"
  | "tooltip"
  | "optional"
  | "widgethint"
  | "enabled"
  | "editable"
  | "valid"
  | "dirty"
>;

/**
 * @description Hook for creating react rich presentation models with wrapped
 * useState for re-rendering.
 *
 */
export function useReactRichPresentationModelFactory<T>(
  options: RichPresentationModelConstructorOptions<T>
): ReactRichPresentationModel<T> {
  const changeTransmitterModel = new RichPresentationModel<T>(options);

  const [uiModel, setUiModel] = useState<ReactRichPresentationUiModel<T>>(
    changeTransmitterModel
  );

  changeTransmitterModel.modelHasChanged.subscribe((newModel) =>
    setUiModel({
      label: newModel.label,
      value: newModel.value,
      baseValue: newModel.baseValue,
      tooltip: newModel.tooltip,
      optional: newModel.optional,
      widgethint: newModel.widgethint,
      enabled: newModel.enabled,
      editable: newModel.editable,
      valid: newModel.valid,
      dirty: newModel.dirty,
    })
  );

  const reactRichPresentationModel: ReactRichPresentationModel<T> = {
    setValue: (newValue: T) => {
      changeTransmitterModel.value = newValue;
    },
    setBaseValue: (newValue: T) => {
      changeTransmitterModel.baseValue = newValue;
    },
    setLabel: (newValue: string) => {
      changeTransmitterModel.label = newValue;
    },
    setEnabled: (newValue: boolean) => {
      changeTransmitterModel.enabled = newValue;
    },
    setEditable: (newValue: boolean) => {
      changeTransmitterModel.editable = newValue;
    },
    setOptional: (newValue: boolean) => {
      changeTransmitterModel.optional = newValue;
    },
    setWidgetHint: (newValue: string) => {
      changeTransmitterModel.widgetHint = newValue;
    },
    setValidator: (newValue: RichPresentationModelValidator<T>) => {
      changeTransmitterModel.validator = newValue;
    },
    setEquals: (newValue: RichPresentationModelEquals<T>) => {
      changeTransmitterModel.equals = newValue;
    },
    uiModel,
  };

  return reactRichPresentationModel;
}

import { Subject } from "rxjs";
import {
  RichPresentationModelValidator,
  RichPresentationModelEquals,
  RichPresentationModelConstructorOptions,
} from "../interfaces";

/**
 * @description Class representing a rich presentation model.
 */
export class RichPresentationModel<T> {
  private _value: T;
  private _baseValue: T;
  private _label: string;
  private _dirty: boolean;
  private _enabled: boolean;
  private _editable: boolean;
  private _validator: RichPresentationModelValidator<T>;
  private _equals: RichPresentationModelEquals<T>;
  private _valid: boolean;
  private _optional: boolean;
  private _tooltip: string;
  private _widgethint: string;

  modelHasChanged: Subject<RichPresentationModel<T>>;

  constructor(options: RichPresentationModelConstructorOptions<T>) {
    /*
     * Setting member variables from input.
     */
    this._label = options.label;
    this._value = options.value;
    this._baseValue = options.baseValue;
    this._enabled = options.enabled;
    this._editable = options.editable;
    this._optional = options.optional;
    this._tooltip = options.tooltip;
    this._widgethint = options.widgethint;
    this._validator = options.validator;
    this._equals = options.equals;
    this.modelHasChanged = new Subject();

    /*
     * Initially setting valid according to input value.
     */
    this._valid = this._validator({
      newValue: this._value,
    });

    /*
     * Initially setting dirty according to input value.
     */
    this._dirty = !this._equals({
      value: this._value,
      baseValue: this._baseValue,
    });
  }

  /*
   * Getters
   */
  get label() {
    return this._label;
  }
  get value() {
    return this._value;
  }
  get tooltip() {
    return this._tooltip;
  }
  get optional() {
    return this._optional;
  }
  get widgethint() {
    return this._widgethint;
  }
  get enabled() {
    return this._enabled;
  }
  get valid() {
    return this._valid;
  }
  get baseValue() {
    return this._baseValue;
  }
  get dirty() {
    return this._dirty;
  }

  /*
   * Setters
   */
  set value(newValue: T) {
    this._value = newValue;

    /*
     * Check if value is valid according to validator and set valid.
     */
    this._valid = this._validator({
      newValue: this._value,
    });

    /*
     * Compare value with comparator and set dirty.
     */
    this._dirty = !this._equals({
      value: this._value,
      baseValue: this._baseValue,
    });

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set baseValue(newBaseValue: T) {
    this._baseValue = newBaseValue;

    /*
     * Set the new dirty according to new base value.
     */
    this._dirty = !this._equals({
      value: this._value,
      baseValue: this._baseValue,
    });

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set label(newValue: string) {
    this._label = newValue;

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set enabled(newValue: boolean) {
    this._enabled = newValue;

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set editable(newValue: boolean) {
    this._editable = newValue;

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set optional(newValue: boolean) {
    this._optional = newValue;

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set widgetHint(newValue: string) {
    this._widgethint = newValue;

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set validator(newValue: RichPresentationModelValidator<T>) {
    this._validator = newValue;

    /*
     * Set the new valid according to new validator callback.
     */
    this._valid = this._validator({
      newValue: this._value,
    });

    /*
     * Emit model has changed for attached listeners.
     */
    this.modelHasChanged.next(this);
  }
  set equals(newValue: RichPresentationModelEquals<T>) {
    this._equals = newValue;

    /*
     * Set the new dirty according to new comparator.
     */
    this._dirty = !this._equals({
      value: this._value,
      baseValue: this._baseValue,
    });
  }
}

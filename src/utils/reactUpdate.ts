/*
 * @Author: mengdaoshizhongxinyang
 * @Date: 2021-10-20 15:07:15
 * @Description: 
 */
import { useState } from "react";
declare const RefSymbol: unique symbol
interface Ref<T = any> {
    value: T
    [RefSymbol]: true
}
declare const ShallowRefMarker: unique symbol
type ShallowRef<T = any> = Ref<T> & { [ShallowRefMarker]?: true }
type UnwrapRef<T> = T extends ShallowRef<infer V> ? V : T

export function ref<T extends object>(
    value: T
): [T] extends [Ref] ? T : Ref<UnwrapRef<T>>
export function ref<T>(value: T): Ref<UnwrapRef<T>>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
    return createRef(value)
}
function isRef(r: any): r is Ref {
    return Boolean(r && r.__v_isRef === true)
}
function createRef(rowValue: unknown) {
    if (isRef(rowValue)) {
        return rowValue
    }
    return new RefImpl(rowValue)
}
function toRaw<T>(observed: T): T {
    const raw = observed && (observed as any)["__v_raw"]
    return raw ? toRaw(raw) : observed
}
const hasChanged = (value: any, oldValue: any): boolean =>
    !Object.is(value, oldValue)
class RefImpl<T>{
    private _value
    private _rawValue: any

    private _setValue

    public readonly __v_isRef = true
    constructor(value: T) {
        const [state, setState] = useState(value)
        this._setValue = setState
        this._rawValue = toRaw(value)
        this._value = state
    }
    get value() {
        return this._value
    }
    set value(newValue) {
        newValue = toRaw(newValue)
        if (hasChanged(newValue, this._rawValue)) {
            this._rawValue = newValue
            this._value = newValue
            this._setValue(newValue)
        }
    }
}

export function reactive<T extends object>(data: T) {
    const [state, setState] = useState(data)
    return new Proxy(
        state,
        {
            set: (target, key, value) => {
                target[key as keyof typeof target] = value
                setState(Object.assign({}, target))
                return true
            }
        }
    )
}
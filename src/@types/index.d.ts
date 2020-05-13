type DataOption = Record<string, any>
type CustomOption = Record<string, any>
type PropertyOption = Record<string, AllProperty>
type MethodOption = Record<string, (...args: any[]) => any>

type PageOptions<
  TData extends DataOption,
  TCustom extends CustomOption
> = WechatMiniprogram.Page.Options<TData, TCustom>

type ComponentOptions<
  TData extends DataOption,
  TProperty extends PropertyOption,
  TMethod extends MethodOption
> = WechatMiniprogram.Component.Options<TData, TProperty, TMethod>

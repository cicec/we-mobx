type AppOptions<T> = WechatMiniprogram.App.Options<T>

const provider = <TStores extends AnyObject>(stores: TStores) => <TAppOptions extends AnyObject>(
  options: AppOptions<TAppOptions>
) => App({ ...options, stores })

export default provider

type AppOptions = WechatMiniprogram.App.Options<AnyObject>

const provider = <T extends AnyObject>(stores: T) => (options: AppOptions) =>
  App({ ...options, stores })

export default provider

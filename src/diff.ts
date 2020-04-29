const ARRAYTYPE = '[object Array]'
const OBJECTTYPE = '[object Object]'
const FUNCTIONTYPE = '[object Function]'

export default function diff(current: AnyObject, pre: AnyObject) {
  const result = {}
  syncKeys(current, pre)
  _diff(current, pre, '', result)
  return result
}

function syncKeys(current: AnyObject, pre: AnyObject) {
  if (current === pre) return
  const rootCurrentType = type(current)
  const rootPreType = type(pre)
  if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
    if (Object.keys(current).length >= Object.keys(pre).length) {
      for (let key in pre) {
        const currentValue = current[key]
        if (currentValue === undefined) {
          current[key] = null
        } else {
          syncKeys(currentValue, pre[key])
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
    if (current.length >= pre.length) {
      pre.forEach((item: any, index: number) => {
        syncKeys(current[index], item)
      })
    }
  }
}

function _diff(current: AnyObject, pre: AnyObject, path: string, result: AnyObject) {
  if (current === pre) return
  const rootCurrentType = type(current)
  const rootPreType = type(pre)
  if (rootCurrentType == OBJECTTYPE) {
    if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
      setResult(result, path, current)
    } else {
      for (let key in current) {
        const currentValue = current[key]
        const preValue = pre[key]
        const currentType = type(currentValue)
        const preType = type(preValue)
        if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
          if (currentValue != pre[key]) {
            setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
          }
        } else if (currentType == ARRAYTYPE) {
          if (preType != ARRAYTYPE) {
            setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
          } else {
            if (currentValue.length < preValue.length) {
              setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
            } else {
              currentValue.forEach((item: any, index: number) => {
                _diff(
                  item,
                  preValue[index],
                  (path == '' ? '' : path + '.') + key + '[' + index + ']',
                  result
                )
              })
            }
          }
        } else if (currentType == OBJECTTYPE) {
          if (
            preType != OBJECTTYPE ||
            Object.keys(currentValue).length < Object.keys(preValue).length
          ) {
            setResult(result, (path == '' ? '' : path + '.') + key, currentValue)
          } else {
            for (let subKey in currentValue) {
              _diff(
                currentValue[subKey],
                preValue[subKey],
                (path == '' ? '' : path + '.') + key + '.' + subKey,
                result
              )
            }
          }
        }
      }
    }
  } else if (rootCurrentType == ARRAYTYPE) {
    if (rootPreType != ARRAYTYPE) {
      setResult(result, path, current)
    } else {
      if (current.length < pre.length) {
        setResult(result, path, current)
      } else {
        current.forEach((item: any, index: number) => {
          _diff(item, pre[index], path + '[' + index + ']', result)
        })
      }
    }
  } else {
    setResult(result, path, current)
  }
}

function setResult(result: AnyObject, k: string, v: any) {
  if (type(v) != FUNCTIONTYPE) {
    result[k] = v
  }
}

function type(obj: AnyObject) {
  return Object.prototype.toString.call(obj)
}

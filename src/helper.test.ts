const basicAuthMiddleware = require('.')

import { getSpecificHostAuth, isHostWhitelisted, isIpAddressInWhitelistedRange, isIpAddressWhitelisted } from './helper'

describe('basicAuthMiddleware', () => {
  const returnedFN = basicAuthMiddleware('test', 'test')

  it('return value is a Function', () => {
    expect(returnedFN).toBeInstanceOf(Function)
  })

  it('returned function has 3 parameter', () => {
    expect(returnedFN.length).toBe(3)
  })
})

describe('isHostWhitelisted', () => {
  it('undefined whitelist should result in "false"', () => {
    const result = isHostWhitelisted('localhost')

    expect(result).toBeFalsy()
  })

  it('empty whitelist should result in  "false"', () => {
    const result = isHostWhitelisted('localhost', [])

    expect(result).toBeFalsy()
  })

  it('whitelisted host should result in "true"', () => {
    const hostWhitelist = ['google.com', 'localhost', '127.0.1.1']
    const host = 'localhost'

    const result = isHostWhitelisted(host, hostWhitelist)

    expect(result).toBeTruthy()
  })

  it('NOT whitelisted host should result in "false"', () => {
    const hostWhitelist = ['google.com', '127.0.1.1']
    const host = 'localhost'

    const result = isHostWhitelisted(host, hostWhitelist)

    expect(result).toBeFalsy()
  })
})

describe('isIpAddressWhitelisted', () => {
  it('undefined whitelist should result in "false"', () => {
    const result = isIpAddressWhitelisted('127.0.0.1')

    expect(result).toBeFalsy()
  })

  it('empty whitelist should result in "false"', () => {
    const result = isIpAddressWhitelisted('127.0.0.1', [])

    expect(result).toBeFalsy()
  })

  it('whitelisted ip address should result in "true', () => {
    const whitelist = ['192.168.0.1', '127.0.0.1']
    const ipAddress = '127.0.0.1'

    const result = isIpAddressWhitelisted(ipAddress, whitelist)

    expect(result).toBeTruthy()
  })

  it('NOT whitelisted ip address should result in "false"', () => {
    const whitelist = ['192.168.0.1', '127.0.0.2']
    const ipAddress = '127.0.0.1'

    const result = isIpAddressWhitelisted(ipAddress, whitelist)

    expect(result).toBeFalsy()
  })
})

describe('isIpAddressInWhitelistedRange', () => {
  it('undefined whitelist should result in "false"', () => {
    const result = isIpAddressInWhitelistedRange('127.0.0.1')

    expect(result).toBeFalsy()
  })

  it('empty whitelist should result in "false"', () => {
    const result = isIpAddressInWhitelistedRange('127.0.0.1', [])

    expect(result).toBeFalsy()
  })

  it('ip address in whitelisted range should result in "true"', () => {
    const whitelist = ['10.10.0.0/16', '192.168.1.1/24']
    const ipAddress = '192.168.1.5'

    const result = isIpAddressInWhitelistedRange(ipAddress, whitelist)

    expect(result).toBeTruthy()
  })

  it('ip address NOT in whitelisted range should result in "false"', () => {
    const whitelist = ['10.10.0.0/16', '192.168.1.1/24']
    const ipAddress = '192.168.2.5'

    const result = isIpAddressInWhitelistedRange(ipAddress, whitelist)

    expect(result).toBeFalsy()
  })
})

describe('getSpecificHostAuth', () => {
  it('undefined host should result in "null"', () => {
    const result = getSpecificHostAuth()

    expect(result).toBe(null)
  })

  it('empty host should result in "null"', () => {
    const result = getSpecificHostAuth('')

    expect(result).toBe(null)
  })

  it('undefined options should result in "null"', () => {
    const result = getSpecificHostAuth('localhost')

    expect(result).toBe(null)
  })

  it('undefined "specificHostAuth" in options should result in "null"', () => {
    const options = {
      hostsWhitelist: ['localhost'],
    }

    const result = getSpecificHostAuth('localhost', options)

    expect(result).toBe(null)
  })

  it('NOT defined host should result in "null"', () => {
    const options = {
      specificHostAuth: {
        'google.de': {
          username: 'test',
          password: 'test',
        },
      },
    }

    const result = getSpecificHostAuth('localhost', options)

    expect(result).toBe(null)
  })

  it('defined host should result auth', () => {
    const options = {
      specificHostAuth: {
        localhost: {
          username: 'test',
          password: 'test',
        },
      },
    }

    const result = getSpecificHostAuth('localhost', options)

    expect(result).toStrictEqual({
      username: 'test',
      password: 'test',
    })
  })
})

import { Request } from 'express'
import exp = require('constants')

interface IAuth {
  username: string
  password: string
}

interface ISpecificHostAuth {
  [key: string]: IAuth
}

export interface IOptions {
  ipAddressWhitelist?: string[]
  ipRangeWhitelist?: string[]
  hostsWhitelist?: string[]
  specificHostAuth?: ISpecificHostAuth
}

export function isIpAddressWhitelisted(ipAddress: string, ipAddressWhitelist?: string[]): boolean {
  if (!ipAddressWhitelist || ipAddressWhitelist.length === 0) {
    return false
  }

  return ipAddressWhitelist.includes(ipAddress)
}

const ip4ToInt = (ip: string) => ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0

const isIp4InCidr = (ip: string) => (cidr: string) => {
  const [range, bits = '32'] = cidr.split('/')
  const mask = ~(2 ** (32 - parseInt(bits, 10)) - 1)

  return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask)
}

const isIp4InCidrs = (ip: string, cidrs: string[]) => cidrs.some(isIp4InCidr(ip))

isIp4InCidrs('192.168.1.5', ['10.10.0.0/16', '192.168.1.1/24']) // true

export function isIpAddressInWhitelistedRange(ipAddress: string, ipAddressRangesWhitelist?: string[]): boolean {
  if (!ipAddressRangesWhitelist || ipAddressRangesWhitelist.length === 0) {
    return false
  }

  return isIp4InCidrs(ipAddress, ipAddressRangesWhitelist)
}

export function isHostWhitelisted(host: string, hostWhitelist?: string[]): boolean {
  if (!hostWhitelist || hostWhitelist.length === 0) {
    return false
  }

  return hostWhitelist.includes(host)
}

export function isAuthNeeded(req: Request, options?: IOptions): boolean {
  if (!options) {
    return true
  }

  const { ipAddressWhitelist, ipRangeWhitelist, hostsWhitelist } = options
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const host = req.get('host')

  if (!(ipAddress && host)) {
    return true
  }

  return !(
    isIpAddressWhitelisted(ipAddress as string, ipAddressWhitelist) ||
    isIpAddressInWhitelistedRange(ipAddress as string, ipRangeWhitelist) ||
    isHostWhitelisted(host, hostsWhitelist)
  )
}

export function getSpecificHostAuth(host?: string, options?: IOptions): IAuth | null {
  if (!(options?.specificHostAuth && host)) {
    return null
  }

  return options.specificHostAuth[host] || null
}

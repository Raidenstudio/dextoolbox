import { createClient as createDeliveryClient } from 'contentful'
import { createClient as createManagementClient } from 'contentful-management'

const spaceId = process.env.CONTENTFUL_SPACE_ID
const environmentId = process.env.CONTENTFUL_ENVIRONMENT || 'master'
const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN
const managementToken = process.env.CONTENTFUL_MANAGEMENT_TOKEN
const defaultLocale = process.env.CONTENTFUL_LOCALE || 'en-US'

let deliveryClient
let previewClient
let managementClient

export const hasDeliveryCredentials = () => Boolean(spaceId && deliveryToken)
export const hasPreviewCredentials = () => Boolean(spaceId && previewToken)
export const hasManagementCredentials = () => Boolean(spaceId && managementToken)

const ensureCredentials = (token, label) => {
  if (!spaceId) throw new Error('CONTENTFUL_SPACE_ID is not set')
  if (!token) throw new Error(`${label} is not set`)
}

export const getDeliveryClient = () => {
  if (deliveryClient) return deliveryClient
  ensureCredentials(deliveryToken, 'CONTENTFUL_DELIVERY_TOKEN')
  deliveryClient = createDeliveryClient({
    space: spaceId,
    environment: environmentId,
    accessToken: deliveryToken
  })
  return deliveryClient
}

export const getPreviewClient = () => {
  if (previewClient) return previewClient
  ensureCredentials(previewToken, 'CONTENTFUL_PREVIEW_TOKEN')
  previewClient = createDeliveryClient({
    space: spaceId,
    environment: environmentId,
    accessToken: previewToken,
    host: 'preview.contentful.com'
  })
  return previewClient
}

export const getManagementClient = () => {
  if (managementClient) return managementClient
  ensureCredentials(managementToken, 'CONTENTFUL_MANAGEMENT_TOKEN')
  managementClient = createManagementClient({ accessToken: managementToken })
  return managementClient
}

export const getSpaceConfig = () => ({
  spaceId,
  environmentId,
  defaultLocale
})

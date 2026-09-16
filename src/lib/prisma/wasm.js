
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  name: 'name',
  avatar: 'avatar',
  role: 'role',
  status: 'status',
  resetPasswordToken: 'resetPasswordToken',
  resetPasswordExpires: 'resetPasswordExpires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  failedLoginAttempts: 'failedLoginAttempts',
  accountLockedUntil: 'accountLockedUntil',
  lastPasswordChange: 'lastPasswordChange',
  twoFactorEnabled: 'twoFactorEnabled',
  twoFactorSecret: 'twoFactorSecret',
  lastLoginAt: 'lastLoginAt',
  lastLoginIp: 'lastLoginIp'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  token: 'token',
  userId: 'userId',
  expiresAt: 'expiresAt',
  revoked: 'revoked',
  replacedByToken: 'replacedByToken',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  details: 'details',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SecurityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  eventType: 'eventType',
  eventLevel: 'eventLevel',
  description: 'description',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  endpoint: 'endpoint',
  method: 'method',
  requestData: 'requestData',
  statusCode: 'statusCode',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.RateLimitLogScalarFieldEnum = {
  id: 'id',
  identifier: 'identifier',
  endpoint: 'endpoint',
  requestCount: 'requestCount',
  windowStart: 'windowStart',
  blocked: 'blocked',
  blockedUntil: 'blockedUntil',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DataExportRequestScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  email: 'email',
  requestType: 'requestType',
  status: 'status',
  exportData: 'exportData',
  exportUrl: 'exportUrl',
  expiresAt: 'expiresAt',
  processedAt: 'processedAt',
  completedAt: 'completedAt',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.BackupScalarFieldEnum = {
  id: 'id',
  type: 'type',
  status: 'status',
  fileName: 'fileName',
  fileSize: 'fileSize',
  location: 'location',
  recordCount: 'recordCount',
  tables: 'tables',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  duration: 'duration',
  verified: 'verified',
  verifiedAt: 'verifiedAt',
  checksum: 'checksum'
};

exports.Prisma.WebhookScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  method: 'method',
  events: 'events',
  headers: 'headers',
  payload: 'payload',
  isActive: 'isActive',
  retryAttempts: 'retryAttempts',
  retryDelay: 'retryDelay',
  timeout: 'timeout',
  lastSuccess: 'lastSuccess',
  lastFailure: 'lastFailure',
  successCount: 'successCount',
  failureCount: 'failureCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdBy: 'createdBy'
};

exports.Prisma.WebhookLogScalarFieldEnum = {
  id: 'id',
  webhookId: 'webhookId',
  event: 'event',
  payload: 'payload',
  response: 'response',
  statusCode: 'statusCode',
  status: 'status',
  attempts: 'attempts',
  errorMessage: 'errorMessage',
  duration: 'duration',
  createdAt: 'createdAt'
};

exports.Prisma.WebhookEventScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  samplePayload: 'samplePayload',
  createdAt: 'createdAt'
};

exports.Prisma.PostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  excerpt: 'excerpt',
  content: 'content',
  blocksData: 'blocksData',
  featuredImage: 'featuredImage',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  metaKeywords: 'metaKeywords',
  focusKeyword: 'focusKeyword',
  ogImage: 'ogImage',
  seoScore: 'seoScore',
  seoIssues: 'seoIssues',
  seoRecommendations: 'seoRecommendations',
  lastSeoCheck: 'lastSeoCheck',
  screpyReportId: 'screpyReportId',
  schemaType: 'schemaType',
  customSchema: 'customSchema',
  schemaMarkup: 'schemaMarkup',
  internalLinks: 'internalLinks',
  linkedFrom: 'linkedFrom',
  readabilityScore: 'readabilityScore',
  wordCount: 'wordCount',
  keywordDensity: 'keywordDensity',
  status: 'status',
  publishedAt: 'publishedAt',
  scheduledAt: 'scheduledAt',
  viewCount: 'viewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorId: 'authorId',
  aiOptimized: 'aiOptimized',
  aiOptimizationScore: 'aiOptimizationScore',
  autoFaqs: 'autoFaqs',
  faqSchema: 'faqSchema',
  directAnswers: 'directAnswers',
  keyTakeaways: 'keyTakeaways',
  authorExpertise: 'authorExpertise',
  lastFactCheck: 'lastFactCheck',
  sources: 'sources',
  conversationalScore: 'conversationalScore',
  questionBasedHeadings: 'questionBasedHeadings',
  aiCitations: 'aiCitations',
  lastAiTest: 'lastAiTest'
};

exports.Prisma.PageScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  status: 'status',
  featuredImage: 'featuredImage',
  content: 'content',
  blocksData: 'blocksData',
  focusKeyword: 'focusKeyword',
  seoTitle: 'seoTitle',
  metaDescription: 'metaDescription',
  canonicalUrl: 'canonicalUrl',
  ogTitle: 'ogTitle',
  ogDescription: 'ogDescription',
  ogImage: 'ogImage',
  twitterTitle: 'twitterTitle',
  twitterDescription: 'twitterDescription',
  twitterImage: 'twitterImage',
  isIndexable: 'isIndexable',
  isFollowable: 'isFollowable',
  advancedRobots: 'advancedRobots',
  enableSchema: 'enableSchema',
  customSchema: 'customSchema',
  headerStyle: 'headerStyle',
  footerStyle: 'footerStyle',
  showSidebar: 'showSidebar',
  mobileSettings: 'mobileSettings',
  customHeadScripts: 'customHeadScripts',
  customFooterScripts: 'customFooterScripts',
  viewCount: 'viewCount',
  publishedAt: 'publishedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorId: 'authorId'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  authorName: 'authorName',
  authorEmail: 'authorEmail',
  authorUrl: 'authorUrl',
  content: 'content',
  status: 'status',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SeoAnalysisScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  url: 'url',
  screpyReportId: 'screpyReportId',
  screpyScore: 'screpyScore',
  screpyData: 'screpyData',
  score: 'score',
  issues: 'issues',
  recommendations: 'recommendations',
  pageSpeed: 'pageSpeed',
  mobileScore: 'mobileScore',
  sslEnabled: 'sslEnabled',
  robotsTxt: 'robotsTxt',
  sitemap: 'sitemap',
  titleTag: 'titleTag',
  metaDescription: 'metaDescription',
  headings: 'headings',
  images: 'images',
  internalLinks: 'internalLinks',
  externalLinks: 'externalLinks',
  wordCount: 'wordCount',
  readability: 'readability',
  keywordUsage: 'keywordUsage',
  schemaTypes: 'schemaTypes',
  schemaValid: 'schemaValid',
  analyzedAt: 'analyzedAt'
};

exports.Prisma.KeywordScalarFieldEnum = {
  id: 'id',
  keyword: 'keyword',
  searchVolume: 'searchVolume',
  difficulty: 'difficulty',
  position: 'position',
  url: 'url',
  trackedSince: 'trackedSince',
  lastChecked: 'lastChecked',
  positionHistory: 'positionHistory',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InternalLinkScalarFieldEnum = {
  id: 'id',
  fromPostId: 'fromPostId',
  toPostId: 'toPostId',
  anchorText: 'anchorText',
  position: 'position',
  relevanceScore: 'relevanceScore',
  createdAt: 'createdAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MediaScalarFieldEnum = {
  id: 'id',
  originalName: 'originalName',
  storedName: 'storedName',
  url: 'url',
  thumbnailUrl: 'thumbnailUrl',
  fileType: 'fileType',
  fileSize: 'fileSize',
  width: 'width',
  height: 'height',
  altText: 'altText',
  title: 'title',
  caption: 'caption',
  description: 'description',
  folder: 'folder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  uploadedById: 'uploadedById'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  sku: 'sku',
  description: 'description',
  shortDescription: 'shortDescription',
  price: 'price',
  salePrice: 'salePrice',
  currency: 'currency',
  featuredImage: 'featuredImage',
  galleryImages: 'galleryImages',
  stockQuantity: 'stockQuantity',
  stockStatus: 'stockStatus',
  status: 'status',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  attributes: 'attributes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  displayOrder: 'displayOrder',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FormSubmissionScalarFieldEnum = {
  id: 'id',
  type: 'type',
  status: 'status',
  data: 'data',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  adClickId: 'adClickId',
  campaignName: 'campaignName',
  adSetName: 'adSetName',
  adName: 'adName',
  campaignSource: 'campaignSource',
  placement: 'placement',
  utmSource: 'utmSource',
  utmMedium: 'utmMedium',
  utmCampaign: 'utmCampaign',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isMultiStep: 'isMultiStep',
  completedSteps: 'completedSteps',
  totalSteps: 'totalSteps',
  timeToComplete: 'timeToComplete',
  leadScore: 'leadScore',
  leadCategory: 'leadCategory',
  scoreFactors: 'scoreFactors',
  pagesBefore: 'pagesBefore',
  timeOnSite: 'timeOnSite',
  scrollDepth: 'scrollDepth',
  exitIntentShown: 'exitIntentShown',
  country: 'country',
  city: 'city',
  region: 'region',
  timezone: 'timezone',
  calculatorUsed: 'calculatorUsed',
  calculatorData: 'calculatorData',
  abTestVariant: 'abTestVariant',
  fieldInteractions: 'fieldInteractions'
};

exports.Prisma.FormWebhookLogScalarFieldEnum = {
  id: 'id',
  formSubmissionId: 'formSubmissionId',
  webhookUrl: 'webhookUrl',
  payload: 'payload',
  response: 'response',
  status: 'status',
  attempts: 'attempts',
  lastAttemptAt: 'lastAttemptAt',
  succeededAt: 'succeededAt',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.AnalyticsScalarFieldEnum = {
  id: 'id',
  pageUrl: 'pageUrl',
  referrer: 'referrer',
  userAgent: 'userAgent',
  ipAddress: 'ipAddress',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdClickScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  campaignName: 'campaignName',
  adSetName: 'adSetName',
  adName: 'adName',
  campaignSource: 'campaignSource',
  placement: 'placement',
  utmSource: 'utmSource',
  utmMedium: 'utmMedium',
  utmCampaign: 'utmCampaign',
  utmTerm: 'utmTerm',
  utmContent: 'utmContent',
  landingPage: 'landingPage',
  referrer: 'referrer',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  device: 'device',
  browser: 'browser',
  country: 'country',
  city: 'city',
  converted: 'converted',
  conversionType: 'conversionType',
  conversionValue: 'conversionValue',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdConversionScalarFieldEnum = {
  id: 'id',
  adClickId: 'adClickId',
  conversionType: 'conversionType',
  conversionValue: 'conversionValue',
  formSubmissionId: 'formSubmissionId',
  createdAt: 'createdAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  group: 'group',
  updatedAt: 'updatedAt'
};

exports.Prisma.AiCitationTestScalarFieldEnum = {
  id: 'id',
  postId: 'postId',
  query: 'query',
  aiModel: 'aiModel',
  cited: 'cited',
  position: 'position',
  context: 'context',
  response: 'response',
  testedAt: 'testedAt'
};

exports.Prisma.FormAbandonmentScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  formType: 'formType',
  currentStep: 'currentStep',
  completedSteps: 'completedSteps',
  email: 'email',
  name: 'name',
  phone: 'phone',
  lastField: 'lastField',
  timeSpent: 'timeSpent',
  device: 'device',
  browser: 'browser',
  country: 'country',
  city: 'city',
  campaignName: 'campaignName',
  adSetName: 'adSetName',
  utmSource: 'utmSource',
  utmMedium: 'utmMedium',
  recoveryEmailSent: 'recoveryEmailSent',
  recovered: 'recovered',
  recoveredAt: 'recoveredAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ExitIntentScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  page: 'page',
  timeOnPage: 'timeOnPage',
  scrollDepth: 'scrollDepth',
  popupType: 'popupType',
  popupContent: 'popupContent',
  action: 'action',
  emailCaptured: 'emailCaptured',
  device: 'device',
  referrer: 'referrer',
  createdAt: 'createdAt'
};

exports.Prisma.BehavioralTriggerScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  triggerType: 'triggerType',
  triggerValue: 'triggerValue',
  actionType: 'actionType',
  actionContent: 'actionContent',
  converted: 'converted',
  page: 'page',
  device: 'device',
  createdAt: 'createdAt'
};

exports.Prisma.CalculatorScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  type: 'type',
  inputs: 'inputs',
  results: 'results',
  leadCaptured: 'leadCaptured',
  formSubmissionId: 'formSubmissionId',
  device: 'device',
  referrer: 'referrer',
  createdAt: 'createdAt'
};

exports.Prisma.LeadScoreScalarFieldEnum = {
  id: 'id',
  formSubmissionId: 'formSubmissionId',
  behaviorScore: 'behaviorScore',
  intentScore: 'intentScore',
  qualityScore: 'qualityScore',
  sourceScore: 'sourceScore',
  totalScore: 'totalScore',
  category: 'category',
  factors: 'factors',
  priority: 'priority',
  calculatedAt: 'calculatedAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AbTestScalarFieldEnum = {
  id: 'id',
  name: 'name',
  element: 'element',
  status: 'status',
  variants: 'variants',
  trafficSplit: 'trafficSplit',
  impressions: 'impressions',
  conversions: 'conversions',
  conversionRates: 'conversionRates',
  winner: 'winner',
  confidence: 'confidence',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ConversionEventScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  eventType: 'eventType',
  eventData: 'eventData',
  page: 'page',
  formType: 'formType',
  abTestVariant: 'abTestVariant',
  occurredAt: 'occurredAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  RefreshToken: 'RefreshToken',
  AuditLog: 'AuditLog',
  SecurityLog: 'SecurityLog',
  RateLimitLog: 'RateLimitLog',
  DataExportRequest: 'DataExportRequest',
  Backup: 'Backup',
  Webhook: 'Webhook',
  WebhookLog: 'WebhookLog',
  WebhookEvent: 'WebhookEvent',
  Post: 'Post',
  Page: 'Page',
  Comment: 'Comment',
  SeoAnalysis: 'SeoAnalysis',
  Keyword: 'Keyword',
  InternalLink: 'InternalLink',
  Category: 'Category',
  Tag: 'Tag',
  Media: 'Media',
  Product: 'Product',
  ProductCategory: 'ProductCategory',
  FormSubmission: 'FormSubmission',
  FormWebhookLog: 'FormWebhookLog',
  Analytics: 'Analytics',
  AdClick: 'AdClick',
  AdConversion: 'AdConversion',
  Setting: 'Setting',
  AiCitationTest: 'AiCitationTest',
  FormAbandonment: 'FormAbandonment',
  ExitIntent: 'ExitIntent',
  BehavioralTrigger: 'BehavioralTrigger',
  Calculator: 'Calculator',
  LeadScore: 'LeadScore',
  AbTest: 'AbTest',
  ConversionEvent: 'ConversionEvent'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)

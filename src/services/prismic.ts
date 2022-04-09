import * as prismic from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';
import PreviewData, { NextApiRequest } from 'next';
// import sm from '../../sm.json';

interface PrismicContext {
  req?: NextApiRequest;
  previewData: any;
}

// todo need refactory
interface PrismicResolver {
  [key: string]: any;
}

export const endpoint = process.env.PRISMIC_API_EDNPOINT;
export const repositoryName = prismic.getRepositoryName(endpoint);

// Update the Link Resolver to match your project's route structure
export function linkResolver(doc: PrismicResolver) {
  switch (doc.type) {
    case 'projects':
      return `/${doc.uid}`;
    default:
      return null;
  }
}

// This factory function allows smooth preview setup
export function createClient(config: PrismicContext) {
  const client = prismic.createClient(endpoint, {
    ...config,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
}

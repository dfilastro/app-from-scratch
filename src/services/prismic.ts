import * as prismic from '@prismicio/client';
import { HttpRequestLike } from '@prismicio/client';
import { enableAutoPreviews } from '@prismicio/next';

import { NextApiRequest } from 'next';

export interface PrismicConfig {
  req?: HttpRequestLike;
}

// export const endpoint = process.env.PRISMIC_API_EDNPOINT;
// export const repositoryName = prismic.getRepositoryName(endpoint);

export function getPrismicClient(config: PrismicConfig): prismic.Client {
  const client = prismic.createClient(process.env.PRISMIC_API_EDNPOINT);

  enableAutoPreviews({ client, req: config.req });

  return client;
}

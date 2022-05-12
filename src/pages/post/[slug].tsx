import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import * as prismic from '@prismicio/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { endpoint } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: { text: string };
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const total = post.data.content.reduce((acc, content) => {
    acc += content.heading[0].text.split(' ').length;

    const numWords = content.body.map(i => i.text.split(' ').length);
    numWords.map(w => (acc += w));

    return acc;
  }, 0);

  const readingTime = Math.ceil(total / 200);

  const router = useRouter();
  if (router.isFallback) return <h1>Carregando...</h1>;

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling </title>
      </Head>
      <Header />
      <img src={post.data.banner.url} alt="banner" className={styles.postImg} />
      <main className={commonStyles.container}>
        <div className={styles.postContainer}>
          <div className={styles.postTitle}>
            <h1>{post.data.title}</h1>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>{formatedDate}</p>
              </div>
              <div>
                <FiUser />
                <p>{post.data.author}</p>
              </div>
              <div>
                <FiClock />
                <p>{`${readingTime} min`}</p>
              </div>
            </div>
          </div>

          {post.data.content.map(content => {
            return (
              <article key={content.heading[0].text}>
                <h2>{content.heading[0].text}</h2>
                <div
                  className={styles.postContainer}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = prismic.createClient(endpoint);
  const posts = await client.getAllByType('posts');

  const paths = posts.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const client = prismic.createClient(endpoint);
  const { slug } = context.params;

  const response = await client.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title[0].text,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author[0].text,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: [...content.body],
        };
      }),
    },
  };

  return { props: { post } };
};

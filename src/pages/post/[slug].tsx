import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { getPrismicClient } from '../../services/prismic';
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
      heading: string;
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
  console.log(post);
  const total = post.data.content.reduce((acc, current) => {
    acc += current.heading.split(' ').length;

    const numWords = current.body.map(i => i.text.split(' ').length);
    numWords.map(w => (acc += w));

    return acc;
  }, 0);

  const readingTime = Math.ceil(total / 200);

  const router = useRouter();
  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

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
              <article key={content.heading + ''}>
                <h2>{content.heading}</h2>
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
  const client = getPrismicClient({});
  const posts = await client.getByType('posts');

  const paths = posts.results.map(post => {
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
  const client = getPrismicClient({});
  const { slug } = context.params;

  const response = await client.getByUID('posts', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
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

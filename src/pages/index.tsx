import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';
import Prismic from '@prismicio/client';

import { FiCalendar, FiUser } from 'react-icons/fi';

// import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { createClient } from '../services/prismic';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ posts }) {
  // const formatedPosts = postsPagination.results.map(post => {
  //   return {
  //     ...post,
  //     first_publication_date: format(
  //       new Date(post.first_publication_date),
  //       'dd MMM yyyy',
  //       { locale: ptBR }
  //     ),
  //   };
  // });

  // const [posts, setPosts] = useState<Post[]>(formatedPosts);
  return (
    <>
      <Head>
        <title> Blog Ignite | RocketSeat</title>
      </Head>

      <main className={commonStyles.container}>
        <Header />

        <section className={styles.container}>
          {posts?.map(post => (
            <Link href={`/posts/${post.uid}`} key={post.uid}>
              <div className={styles.postContainer}>
                <h1 className={styles.postTitle}>{post.data.title}</h1>
                <p className={styles.postAbstract}>{post.data.subtitle}</p>
                <div className={styles.postData}>
                  <div>
                    <FiCalendar />
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          <button type="button">Carregar mais posts</button>
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const client = createClient({ previewData });

  const response = await client.getAllByType('posts', {
    pageSize: 1,
  });

  const posts = response.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title[0].text,
        subtitle: post.data.subtitle[0].text,
        author: post.data.author[0].text,
      },
    };
  });

  // const postsPagination = {
  //   next_page: response.next_page,
  //   results: posts,
  // };

  return {
    props: { posts },
  };
};

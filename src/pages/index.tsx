import { GetStaticProps } from 'next';
import Head from 'next/head';
import Header from '../components/Header';

import { FiCalendar, FiUser } from 'react-icons/fi';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { getPrismicClient } from '../services/prismic';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const formatted = postsPagination.results.map(post => {
    return {
      uid: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });

  const [posts, setPosts] = useState(formatted);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [currentPage, setCurrentPage] = useState(1);

  async function handleNextPage(): Promise<void> {
    if (currentPage !== 1 && nextPage === null) return;

    const postsResults = await fetch(`${nextPage}`).then(response =>
      response.json()
    );

    setNextPage(postsResults.next_page);
    setCurrentPage(postsResults.page);

    const newPosts = postsResults.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: format(
          new Date(post.first_publication_date),
          'dd MMM yyyy',
          {
            locale: ptBR,
          }
        ),

        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title> Blog Ignite | RocketSeat</title>
      </Head>

      <main className={commonStyles.container}>
        <Header />

        <section className={styles.container}>
          {posts?.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <div className={styles.postContainer}>
                <h1 className={styles.postTitle}>{post.title}</h1>
                <p className={styles.postAbstract}>{post.subtitle}</p>
                <div className={styles.postData}>
                  <div>
                    <FiCalendar />
                    <p>{post.first_publication_date}</p>
                  </div>
                  <div>
                    <FiUser />
                    <p>{post.author}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nextPage && (
            <button type="button" onClick={handleNextPage}>
              Carregar mais posts
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient({});

  const response = await client.getByType('posts', {
    pageSize: 1,
  });

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  };

  return {
    props: { postsPagination },
  };
};

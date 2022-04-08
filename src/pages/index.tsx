import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Header from '../components/Header';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home() {
  return (
    <>
      <Head>
        <title> Blog Ignite | RocketSeat</title>
      </Head>

      <main className={commonStyles.container}>
        <Header />
        <section className={styles.container}>
          <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>Como Utilizar Hooks</h1>
            <p className={styles.postAbstract}>
              Pensando em sincronização em vez de ciclos de vida
            </p>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>22 Mar 2022</p>
              </div>
              <div>
                <FiUser />
                <p>Rikieri Sartor</p>
              </div>
            </div>
          </div>

          <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>Criando um App CRA do zero</h1>
            <p className={styles.postAbstract}>
              Tudo sobre como criar sua primeira aplicação usando o Create React
              App
            </p>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>19 Abr 2022</p>
              </div>
              <div>
                <FiUser />
                <p>Diego Filastro</p>
              </div>
            </div>
          </div>

          <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>Como Utilizar Hooks</h1>
            <p className={styles.postAbstract}>
              Pensando em sincronização em vez de ciclos de vida
            </p>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>22 Mar 2022</p>
              </div>
              <div>
                <FiUser />
                <p>Rikieri Sartor</p>
              </div>
            </div>
          </div>

          <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>Criando um App CRA do zero</h1>
            <p className={styles.postAbstract}>
              Tudo sobre como criar sua primeira aplicação usando o Create React
              App
            </p>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>19 Abr 2022</p>
              </div>
              <div>
                <FiUser />
                <p>Diego Filastro</p>
              </div>
            </div>
          </div>

          <div className={styles.postContainer}>
            <h1 className={styles.postTitle}>Criando um App CRA do zero</h1>
            <p className={styles.postAbstract}>
              Tudo sobre como criar sua primeira aplicação usando o Create React
              App
            </p>
            <div className={styles.postData}>
              <div>
                <FiCalendar />
                <p>19 Abr 2022</p>
              </div>
              <div>
                <FiUser />
                <p>Diego Filastro</p>
              </div>
            </div>
          </div>

          <button type="button">Carregar mais posts</button>
        </section>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

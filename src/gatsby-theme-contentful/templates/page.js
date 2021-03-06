import React, { Fragment } from 'react';
import { navigate, graphql } from 'gatsby';
import WidgetHandler from 'gatsby-theme-contentful/src/components/WidgetHandler';
import { Auth0Provider } from 'gatsby-theme-contentful/src/react-auth0-spa';
import AuthContainer from 'gatsby-theme-contentful/src/components/UI/AuthContainer';
import NoAuthContainer from 'gatsby-theme-contentful/src/components/UI/NoAuthContainer';

const isBrowser = typeof window !== `undefined`;

const onRedirectCallback = appState => {
  navigate(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

export default function PageTemplate({
  pageContext,
  data: { allContentfulPage: page },
}) {
  const pageData = page.nodes[0];
  const { isAuthApp } = pageContext;
  return (
    <Fragment>
      {isAuthApp ? (
        <Auth0Provider
          domain={process.env.GATSBY_AUTH0_DOMAIN}
          client_id={process.env.GATSBY_AUTH0_CLIENT_ID}
          redirect_uri={isBrowser ? window.location.origin : '/'}
          onRedirectCallback={onRedirectCallback}
        >
          <AuthContainer
            siteTitle={pageContext.siteTitle}
            brand={pageContext.brand}
            copyright={pageContext.copyrightMessage}
            loginOption={pageContext.loginOption}
            isAuthApp={pageContext.isAuthApp}
          >
            <WidgetHandler pageContext={pageContext} page={pageData} />
          </AuthContainer>
        </Auth0Provider>
      ) : (
        <NoAuthContainer
          siteTitle={pageContext.siteTitle}
          brand={pageContext.brand}
          newsletter={pageContext.newsletter}
          copyright={pageContext.copyrightMessage}
          loginOption={pageContext.loginOption}
          isAuthApp={pageContext.isAuthApp}
        >
          <WidgetHandler pageContext={pageContext} page={pageData} />
        </NoAuthContainer>
      )}
    </Fragment>
  );
}

export const query = graphql`
  query MyQuery($pageId: String) {
    allContentfulPage(filter: { id: { eq: $pageId } }) {
      nodes {
        id
        title
        slug
        pageType
        section {
          title
          description {
            json
          }
          image {
            description
            fluid(maxWidth: 1904, quality: 100) {
              ...GatsbyContentfulFluid_noBase64
            }
          }
          slug
          order
          item {
            title
            subHeader
            link
            slug
          }
          gallery {
            title
            description
            fluid(maxWidth: 400, quality: 100) {
              ...GatsbyContentfulFluid_noBase64
            }
          }
        }
      }
    }
  }
`;

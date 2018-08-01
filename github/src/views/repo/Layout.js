import React, { PureComponent } from 'react';
import { Loader, Nav } from 'rsuite';
import { Link } from 'react-router';
import axios from 'axios';
import { normalize } from 'normalizr';
import { updateEntities } from '@/redux/modules/entities';
import * as Entity from '@/constants/Entities';
import connect from 'react-redux/es/connect/connect';
import { selectRepo } from '@/redux/selectors';
import ToJS from '@/hocs/ToJS';

function NavTab(props) {
  return <Nav.Item componentClass={Link} {...props} />;
}

class RepositoryLayout extends PureComponent {

  componentDidMount() {
    this.fetchRepository();
  }

  fetchRepository() {
    const { dispatch, params: { owner, name } } = this.props;
    return axios(`/repos/${owner}/${name}`)
      .then(({ data }) => {
        const { result, entities } = normalize(data, Entity.Repository);
        dispatch(updateEntities(entities));
      });
  }

  render() {
    const { children, repository, params: { owner, name }, router: { isActive } } = this.props;
    const repoUrl = repository ? `/${repository.full_name}` : `/${owner}/${name}`;

    return (
      <div className="page-content">
        <Nav
          appearance="subtle"
        >
          <NavTab to={repoUrl} active={isActive(repoUrl, true) || isActive(`${repoUrl}/commits`)}>Code</NavTab>
          <NavTab to={`${repoUrl}/issues`} active={isActive(`${repoUrl}/issues`)}>Issues</NavTab>
          <NavTab to={`${repoUrl}/pulls`} active={isActive(`${repoUrl}/pulls`)}>Pull requests</NavTab>
          <NavTab to={`${repoUrl}/projects`} active={isActive(`${repoUrl}/projects`)}>Projects</NavTab>
          <NavTab to={`${repoUrl}/wiki`} active={isActive(`${repoUrl}/wiki`)}>Wiki</NavTab>
          <NavTab to={`${repoUrl}/pulse`} active={isActive(`${repoUrl}/pulse`)}>Insights</NavTab>
          <NavTab to={`${repoUrl}/settings`} active={isActive(`${repoUrl}/settings`)}>Settings</NavTab>
        </Nav>
        {
          repository &&
          <div className="repository-content">
            {children}
          </div>
        }
      </div>
    );
  }
}

module.exports = connect(
  (state, { params: { owner, name } }) => ({
    repository: selectRepo(owner, name)(state),
  }),
)(ToJS(RepositoryLayout));
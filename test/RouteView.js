import React from 'react';
import {expect} from 'chai';
import {mount} from 'enzyme';
import {mobxPlugin, RouterStore} from 'mobx-router5';
import {createTestRouter} from './utils/test-utils';
import RouteView from '../src/modules/RouteView';

describe('routeNode hoc', () => {
  let router;
  let routerStore;
  let routes;

  const DComp = (props) => <div id="d-comp"/>;
  DComp.displayName = 'CComp';

  const HComp = (props) => <div id="h-comp"/>;
  HComp.displayName = 'GComp';

  const MComp = (props) => <div id="m-comp"/>;
  MComp.displayName = 'MComp';

  before(function () {
    routes = [
      {name: 'a', path: '/a'},
      {name: 'b', path: '/b'},
      {name: 'c', path: '/c'},
      {
        name: 'd', path: '/d', component: DComp, children: [
        {name: 'e', path: '/e'},
        {name: 'f', path: '/f'},
        {name: 'g', path: '/g'},
        {
          name: 'h', path: '/h', component: HComp, children: [
          {name: 'i', path: '/i'},
          {name: 'l', path: '/l'},
          {name: 'm', path: '/m', component: MComp}
        ]}
      ]}
    ];

    router = createTestRouter();
    routerStore = new RouterStore();
    router.usePlugin(mobxPlugin(routerStore));

  });

  context('Exceptions', function () {

    it('should throw when route prop is not passed', () => {
      const RouteComp = (props) => (
        <RouteView routes={routes}/>
      );

      const renderComp = () => mount(
        <RouteComp />
      );
      expect(renderComp).to.throw();
    });

    it('should render the default error message with default color when an exception occurs', () => {
      const route = { name: 'd.h.l' }; // A route without component

      const RouteComp = (props) => (
        <RouteView routes={routes} route={route} routeNodeName="d.h"/>
      );

      const renderedL = mount(
        <RouteComp />
      );

      expect(renderedL.find('h1')).to.have.text('Something went wrong.');
      expect(renderedL.find('h1')).to.have.style('color', 'rgb(217, 83, 79)');

    });

    it('should render a custom error message with a custom style when an exception occurs', () => {
      const route = { name: 'd.h.l' }; // A route without component

      const RouteComp = (props) => (
        <RouteView routes={routes} route={route} routeNodeName="d.h" errorMessage={'Ay, caramba!'} errorStyle={{color: 'rgb(200, 90, 34)', 'fontWeight': 'bold' }}/>
      );

      const renderedL = mount(
        <RouteComp />
      );

      expect(renderedL.find('h1')).to.have.text('Ay, caramba!');
      expect(renderedL.find('h1')).to.have.style('color', 'rgb(200, 90, 34)');
      expect(renderedL.find('h1')).to.have.style('font-weight', 'bold');

    });


  });

  context('Render the Component', function () {

    it('Find and Render the Component associated with the route d.h.m ', () => {

      const route = {
        name: 'd.h.m'
      };

      const renderedD = mount(
        <RouteView routes={routes} route={route} routeNodeName=""/>
      );
      expect(renderedD.find('div')).to.have.attr('id', 'd-comp');

      const renderedH = mount(
        <RouteView routes={routes} route={route} routeNodeName="d"/>
      );
      expect(renderedH.find('div')).to.have.attr('id', 'h-comp');

      const renderedM = mount(
        <RouteView routes={routes} route={route} routeNodeName="d.h"/>
      );
      expect(renderedM.find('div')).to.have.attr('id', 'm-comp');

    });

  });

});

/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 */

import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { BaseComponent, css, composeRenderFunction } from 'office-ui-fabric-react/lib/Utilities';
import * as React from 'react';
import './Accordion.scss';
import { IAccordion, IAccordionProps } from './Accordion.types';

export interface IAccordionState {
  // represents whether the accordion is currently expanded or closed.
  isContentVisible?: boolean | undefined;
}

export class Accordion extends BaseComponent<IAccordionProps, IAccordionState> implements IAccordion {
  constructor(props: IAccordionProps) {
    super(props);

    this.state = {
      isContentVisible: false
    };
  }

  public componentDidUpdate(prevProps: IAccordionProps, prevState: IAccordionState): void {
    if (this.state.isContentVisible && !prevState.isContentVisible && this.props.onOpen) {
      this.props.onOpen();
    } else if (!this.state.isContentVisible && prevState.isContentVisible && this.props.onClose) {
      this.props.onClose();
    }
  }

  public render(): JSX.Element {
    const { onRenderMenu, className, buttonAs, onClick, ...other } = this.props;
    let { menuIconProps } = this.props;

    const AccordionButton = buttonAs || DefaultButton;

    if (!menuIconProps) {
      menuIconProps = this.state.isContentVisible ? { iconName: 'ChevronUp' } : { iconName: 'ChevronDown' };
    }

    const onRenderContent = onRenderMenu ? composeRenderFunction(this.props.onRenderContent, onRenderMenu) : this.props.onRenderContent;

    return (
      <div className={css('ba-Accordion', this.state.isContentVisible && 'ba-Accordion--contentVisible', className)}>
        <AccordionButton
          onClick={this.toggleState}
          onMenuClick={this.toggleState}
          menuIconProps={menuIconProps}
          className={'ba-Accordion-header'}
          aria-expanded={this.state.isContentVisible}
          {...other}
        />
        {this.state.isContentVisible && <div className={'ba-Accordion-content'}>{onRenderContent(this.props.menuProps)}</div>}
      </div>
    );
  }

  public toggleState = () => {
    this.setState((prevState: IAccordionState) => {
      return { isContentVisible: !prevState.isContentVisible };
    });
  };
}

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
   Version,
   Environment
} from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import { IMyInfo } from './model/MyInfoService/IMyInfo';
import { IMyInfoService } from './model/MyInfoService/IMyInfoService';
import { MyInfoServiceFactory } from './model/MyInfoService/MyInfoServiceFactory';

import * as strings from 'FetchWebPartStrings';
import Fetch from './components/Fetch';
import { IFetchProps } from './components/IFetchProps';
import { IFetchWebPartProps } from './IFetchWebPartProps';

export default class FetchWebPart extends BaseClientSideWebPart<IFetchWebPartProps> {

  public render(): void {

    let service = MyInfoServiceFactory.getService(Environment.type);
    service.get(this.context)
    .then((result: IMyInfo) => {
      let display = result.myName + "\n";
      for (let i of result.spListNames) {
        display += i + " ";
      }
      for (let i of result.customers) {
        display += i + " ";
      }
      const element: React.ReactElement<IFetchProps > = React.createElement(
        Fetch,
        {
          description: display
        }
      );
  
      ReactDom.render(element, this.domElement);
    })
    .catch((message: string) => {
      const element: React.ReactElement<IFetchProps > = React.createElement(
        Fetch,
        {
          description: `ERROR: ${message}`
        }
      );
  
      ReactDom.render(element, this.domElement);
    });

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SankeyDiagramComponent } from "./components/sankey-diagram/sankey-diagram.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SankeyDiagramComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'snakey';
  public apiData = 
  {
    "total_count": 233,
    "topic_pages": [
      {
        "id": 575,
        "name": "Economy",
        "light_icon": "https://cdn-icons-png.flaticon.com/512/25/25231.png",
        "dark_icon": "https://cdn-icons-png.flaticon.com/512/25/25231.png",
        "count": 179,
        "classifications": [
          {
            "id": 511,
            "key": "reports",
            "name": "Reports",
            "light_icon": "/sites/default/files/2023-08/reports-text-black-icon.svg",
            "dark_icon": "/sites/default/files/2023-08/reports-text-white-icon.svg",
            "count": 139,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 64
              },
              {
                "name": "3 - Secret",
                "id": 3,
                "label": "Secret",
                "count": 46
              },
              {
                "name": "2 - Sensitive",
                "id": 2,
                "label": "Sensitive",
                "count": 17
              },
              {
                "name": "1 - Confidential",
                "id": 1,
                "label": "Confidential",
                "count": 12
              }
            ]
          },
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 37,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 35
              },
              {
                "name": "1 - Confidential",
                "id": 1,
                "label": "Confidential",
                "count": 1
              },
              {
                "name": "3 - Secret",
                "id": 3,
                "label": "Secret",
                "count": 1
              }
            ]
          },
          {
            "id": 509,
            "key": "experimental_statistics",
            "name": "Experimental Statistics",
            "light_icon": "/sites/default/files/2023-07/IFP%20indicators%20New.svg",
            "dark_icon": "/sites/default/files/2023-07/IFP%20indicators_new.svg",
            "count": 3,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 3
              }
            ]
          }
        ]
      },
      {
        "id": 574,
        "name": "Population & Demographic",
        "light_icon": "/sites/default/files/2023-07/population-black_0.svg",
        "dark_icon": "/sites/default/files/2023-07/population-white_0.svg",
        "count": 35,
        "classifications": [
          {
            "id": 511,
            "key": "reports",
            "name": "Reports",
            "light_icon": "/sites/default/files/2023-08/reports-text-black-icon.svg",
            "dark_icon": "/sites/default/files/2023-08/reports-text-white-icon.svg",
            "count": 31,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 31
              }
            ]
          },
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 3,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 3
              }
            ]
          },
          {
            "id": 509,
            "key": "experimental_statistics",
            "name": "Experimental Statistics",
            "light_icon": "/sites/default/files/2023-07/IFP%20indicators%20New.svg",
            "dark_icon": "/sites/default/files/2023-07/IFP%20indicators_new.svg",
            "count": 1,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 1
              }
            ]
          }
        ]
      },
      {
        "id": 581,
        "name": "Agriculture & Environment",
        "light_icon": "/sites/default/files/2023-07/environment-black_0.svg",
        "dark_icon": "/sites/default/files/2023-08/environment-white.svg",
        "count": 6,
        "classifications": [
          {
            "id": 511,
            "key": "reports",
            "name": "Reports",
            "light_icon": "/sites/default/files/2023-08/reports-text-black-icon.svg",
            "dark_icon": "/sites/default/files/2023-08/reports-text-white-icon.svg",
            "count": 6,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 6
              }
            ]
          }
        ]
      },
      {
        "id": 3198,
        "name": "Social Statistics",
        "light_icon": "/sites/default/files/2023-07/people-community-svgrepo-com_0.svg",
        "dark_icon": "/sites/default/files/2023-07/people-community-svgrepo-com-white_0.svg",
        "count": 4,
        "classifications": [
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 3,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 3
              }
            ]
          },
          {
            "id": 511,
            "key": "reports",
            "name": "Reports",
            "light_icon": "/sites/default/files/2023-08/reports-text-black-icon.svg",
            "dark_icon": "/sites/default/files/2023-08/reports-text-white-icon.svg",
            "count": 1,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 1
              }
            ]
          }
        ]
      },
      {
        "id": 579,
        "name": "Labour Force",
        "light_icon": "/sites/default/files/2023-07/labour-force.svg",
        "dark_icon": "/sites/default/files/2023-07/labour-force-svgrepo-white.svg",
        "count": 3,
        "classifications": [
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 3,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 2
              },
              {
                "name": "2 - Sensitive",
                "id": 2,
                "label": "Sensitive",
                "count": 1
              }
            ]
          }
        ]
      },
      {
        "id": 5004,
        "name": "Census",
        "light_icon": "/sites/default/files/2024-05/black.svg",
        "dark_icon": "/sites/default/files/2024-05/white.svg",
        "count": 2,
        "classifications": [
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 2,
            "data_classifications": [
              {
                "name": "1 - Confidential",
                "id": 1,
                "label": "Confidential",
                "count": 2
              }
            ]
          }
        ]
      },
      {
        "id": 5231,
        "name": "Executive Insights",
        "light_icon": "/sites/default/files/2025-03/economy-black_0.svg",
        "dark_icon": "/sites/default/files/2025-03/economy-white_1.svg",
        "count": 2,
        "classifications": [
          {
            "id": 511,
            "key": "reports",
            "name": "Reports",
            "light_icon": "/sites/default/files/2023-08/reports-text-black-icon.svg",
            "dark_icon": "/sites/default/files/2023-08/reports-text-white-icon.svg",
            "count": 2,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 2
              }
            ]
          }
        ]
      },
      {
        "id": 3199,
        "name": "Industry & Business",
        "light_icon": "/sites/default/files/2023-07/industry-svgrepo-com_1.svg",
        "dark_icon": "/sites/default/files/2023-07/industry-svgrepo-white_1.svg",
        "count": 2,
        "classifications": [
          {
            "id": 508,
            "key": "analytical_apps",
            "name": "Analytical Apps",
            "light_icon": "/sites/default/files/2023-07/Analytical%20apps_new.svg",
            "dark_icon": "/sites/default/files/2023-07/Analytical%20apps__new.svg",
            "count": 1,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 1
              }
            ]
          },
          {
            "id": 509,
            "key": "experimental_statistics",
            "name": "Experimental Statistics",
            "light_icon": "/sites/default/files/2023-07/IFP%20indicators%20New.svg",
            "dark_icon": "/sites/default/files/2023-07/IFP%20indicators_new.svg",
            "count": 1,
            "data_classifications": [
              {
                "name": "0 - Open",
                "id": null,
                "label": "Open",
                "count": 1
              }
            ]
          }
        ]
      }
    ]
  }
}
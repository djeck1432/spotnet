import SyntaxHighlighter from '@/components/shared/SyntaxHighlighter'

const FolderStructure = () => {
    return (
        <>
            <p>
                In this section you will find the basic folder structure and
                everything you need to get the template up and running. Both the
                demo and starter versions have the same structure, except that
                the starter version will have fewer files & folders than the
                demo version as they are not required in the starter.
            </p>
            <p>Below is a schematic diagram of directory structure:</p>
            <SyntaxHighlighter>
                {`
├── public                        # Static resource
|   ├── img                       # Images
|   ├── data                      # Static data
|   └── ...                       # Other static files
├── src
│   ├── @types                    # type files that share across the temeplate
│   │   ├── ...                   
│   ├── assets                    # App static resource
│   │   ├── maps                  # Map meta data 
│   │   ├── markdown              # Markdown files
│   │   ├── styles                # Global CSS files
│   │   └── svg	                  # SVG files
│   ├── components                # General components
│   │   ├── docs                  # Documentations related components
│   │   ├── layout                # Layout components
│   │   ├── route                 # Components related to route
│   │   ├── shared                # Upper level components built on top of ui components
│   │   ├── template              # Template components, such as Header, Footer, Nav, etc...
│   │   └── ui                    # Bottom level components, such as Button, Dropdown, etc...
│   ├── configs                   # Configuration files        
│   │   └── ...          
│   ├── constants                 # Constant files
│   │   └── ...      
│   ├── locales                   # Localization configuration
│   │   ├── lang
│   │   |   └── ...               # Language JSON files
│   │   └── index.ts              # Localization entry file
│   ├── mock                      # Mock data for fake API Calls
│   │   ├── data                  # Mock data
│   │   |   └── ...               # Mock data TS files
│   │   ├── fakeApi               # Fake API configuration
│   │   |   └── ...               # Fake API TS files
│   │   └── index.ts              # Mock entry file
│   ├── services                  # Service files for managing API integrations
│   │   ├── ApiService.ts         # Api request & response handler
│   │   ├── BaseService.ts        # Axios configs & interceptors
│   │   └── ...                   # Other service files
│   ├── store                     # Main Redux store
│   │   ├── slices                # Genaral slices 
│   │   |   └── ...           
│   │   ├── hook.ts               # Store hook file    
│   │   ├── index.ts              # Store entry file
│   │   └── rootReducer.ts        # Root reducer
│   │   └── storeSetup.ts         # Overall store setup
│   ├── utils                     # All reusable function & hooks
│   │   ├── hooks                 # Hooks
│   │   |   └── ...      					
│   │   └── ...                   # Reusable functions 
│   ├── views                     # View files that render all the pages
│   |   ├── ...                   # All view files
│   |   └── index.ts              # View entry point
│   |   App.tsx                   # App setup
│   |   index.css                 # Css entry
│   |   main.tsx                  # React entry
│   |   mdDynamicImporter.tsx     # Dynamic md file import handling
│   └── vite-env.d.ts             # Vite environment declaration
├── .twSafelistGenerator          # Tailwind middleware for safe list
├── .eslintignore                 # Ignore file for eslint  
├── .eslintrc.cjs                 # eslint config
├── .gitignore                    # Ignore file for git
├── .prettierignore               # Ignore file for prettier
├── .prettierrc                   # Prettier config 
├── index.html                    # Entry file for the web
├── package.json                  
├── package.lock.json            
├── postcss.config.cjs            # PostCss configuration file
├── README.md  
├── safelist.txt                  # A generated whitelist classes for Tailwind css 
├── tailwind.config.cjs           # TailwindCSS configuration file
├── tsconfig.eslint.json          # Typescript config for eslint
├── tsconfig.json                 # Project Typescript configuration file
├── tsconfig.eslint.json          # Typescript config for node
└── vite.config.ts                # Config file for vite
`}
            </SyntaxHighlighter>
        </>
    )
}

export default FolderStructure

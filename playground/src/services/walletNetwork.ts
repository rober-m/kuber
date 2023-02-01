import { reactive, ref, type Ref } from 'vue'
const api=reactive({})

enum AddNetworkErrorEnums {
  EmptyName = "Network name shouldnot be empty!!",
  EmptyUrl = "Url shouldnot be empty!!",
  DuplicateName = "Network name must be unique!!",
}
export enum  NetworkName {
    Auto="auto",
    PreviewTestnet="previwTestnet",
    PreprodTestnet="preprodTestnet",
    Mainnet="mainnet",
    Localhost="localhost",
  }

export const NetworkUrls = {
    [NetworkName.PreviewTestnet]   :  "https://preview.kuberide.com",
    [NetworkName.PreprodTestnet]   :  "https://preprod.kuberide.com",
    [NetworkName.Mainnet]          :  "https://mainnet.kuberide.com",
    [NetworkName.Localhost]        :  "http://localhost:8081",
  };
  
export const defaultNetworks= reactive( {
        [NetworkName.Auto]:{
            text: "text-[#60A5FA]",
            name: "Auto",
            border: "border-[#60A5FA]",
            display: import.meta.env.VITE_API_URL === undefined ? "Automatically choose Mainnet/PreProd": "This server's API backend",
            url: import.meta.env.VITE_API_URL,
          },
        [NetworkName.PreviewTestnet]: {
          text: "text-blue-400",
          border: "border-blue-400",
          name: "Preview Testnet",
          display:
            localStorage.getItem(NetworkName.PreviewTestnet) ||
            NetworkUrls[NetworkName.PreviewTestnet],
          url:
            localStorage.getItem(NetworkName.PreviewTestnet) ||
            NetworkUrls[NetworkName.PreviewTestnet],
        },
        [NetworkName.PreprodTestnet]: {
          text: "text-orange-400",
          border: "border-orange-400",
          name: "Preprod Testnet",
          display:
            localStorage.getItem(NetworkName.PreprodTestnet) ||
            NetworkUrls[NetworkName.PreprodTestnet],
          url:
            localStorage.getItem(NetworkName.PreprodTestnet) ||
            NetworkUrls[NetworkName.PreprodTestnet],
        },
        [NetworkName.Mainnet]: {
          text: "text-red-400",
          border: "border-red-400",
          name: "Mainnet",
          display:
            localStorage.getItem(NetworkName.Mainnet) ||
            NetworkUrls[NetworkName.Mainnet],
          url:
            localStorage.getItem(NetworkName.Mainnet) ||
            NetworkUrls[NetworkName.Mainnet],
        },
        [NetworkName.Localhost]: {
          text: "text-gray-500",
          border: "border-blue-500",
          name: "Localhost",
          display:
            localStorage.getItem(NetworkName.Localhost) ||
            NetworkUrls[NetworkName.Localhost],
          url:
            localStorage.getItem(NetworkName.Localhost) ||
            NetworkUrls[NetworkName.Localhost],
        },
      }
)
const  customNetworks=reactive(JSON.parse(localStorage.getItem("networks")) || {});

export interface Network{
  text: string,
  border:string,
  name:string,
  display: string,
  url: string| undefined
}
export const  networks : Record<NetworkName,Network>  =reactive({
        ...defaultNetworks,
        ...customNetworks,
    })
export interface AddNetworkError  {
    name: string,
    url: string
}
function getActiveNetwork(){
  
  let net=localStorage.getItem("network")
  console.debug("Obtained activeNetwork from storage",net)
  if(net){
    if(networks[net]){
      return ref( networks[net])
    }
  }  
  return ref( net || networks[NetworkName.Mainnet])
}
export let activeNetwork : Ref<Network> = getActiveNetwork()


function validateAddNetwork(name:string, value: string) :AddNetworkError|undefined{

    let error:AddNetworkError = {name:undefined,url:undefined}
    if (name === "name" || !name) {
        error["name"]= AddNetworkErrorEnums.EmptyName
       
    }
    if (networks[name]){
        error["name"] = AddNetworkErrorEnums.DuplicateName
    }
    if(!value){
        error["url"]=(AddNetworkErrorEnums.EmptyUrl) 
    }
    
    if(networks[value.toLocaleLowerCase()]){
        error["name"]= AddNetworkErrorEnums.EmptyName
    }
    return error.name || error.url ? error: undefined
}

export function addNewNetwork(name:string,url:string): AddNetworkError | undefined {
    let err=validateAddNetwork(name,url);
    if(err){
        return err
    }else{
          const newNetwork= {
            text: "text-green-400",
            border: "border-green-400",
            name: name,
            display: url,
            url: url,
          };
          networks[name]=newNetwork
          localStorage.setItem("networks", JSON.stringify(customNetworks));

    }
  }
export function removeNetwork(networkName: string){
    if(networks[networkName] && !defaultNetworks[networkName]){
        customNetworks[networkName]=undefined
        localStorage.setItem("networks", JSON.stringify(customNetworks));
    }
}
export function resetNetwork(networkName: NetworkName) : void{
  localStorage.removeItem(networkName);
  defaultNetworks[networkName].display=  NetworkUrls[networkName];
  defaultNetworks[networkName].url =NetworkUrls[networkName]
}
export function updateUrl(networkName: NetworkName,url:string){
  if(networks[networkName].url!=url){
    localStorage.setItem(networkName,url)
    networks[networkName].url=url
  }
}
export function switchNetwork(networkName: NetworkName){
  console.info("Switching Network:",networkName)
  if(networks[networkName]){
    activeNetwork=networks[networkName]
    localStorage.setItem("network",networkName)
  }
}
export function acquireWallet() {
    return ""
}

  
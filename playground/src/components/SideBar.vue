<script setup lang="ts">
import { Buffer } from "buffer";
import { callKuber,getPolicyIdOfScriptFromKuber,listProviders, signTx, submitTx } from "kuber-client"
import {
  Address,
  BaseAddress,
  Ed25519KeyHash,
  EnterpriseAddress,
  PointerAddress,
} from "@emurgo/cardano-serialization-lib-asmjs";

</script>
<template >
      <!-- utilities screen -->
      <div
        class="flex flex-col w-6/20 h-full bg-white border-y border-borderColor"
      >
        <div
          class="flex justify-between items-center font-medium text-gray-600 2xl:text-sm xl:text-xs lg:text-xs h-fileTabbar w-full border-b border-borderColor bg-white py-3 px-4"
        >
          <p>UTILITIES / {{ utility }}</p>
          <v-icon
            @click="showUtilities(false)"
            class="cursor-pointer"
            name="io-close-outline"
            scale="1.2"
          />
        </div>
        <div class="flex w-full px-4 py-8 2xl:text-base xl:text-sm lg:text-sm">
          <!-- Address utitlity -->
          <div
            class="flex flex-col w-full items-start"
            v-if="utility == UtilitiesEnums.Address"
          >
            <div class="mb-5 font-semibold text-gray-500">Enter Address</div>
            <input
              class="flex w-full input border border-gray-300 focus:border-gray-400"
              type="text"
              :value="address"
              @input="onAddressInput"
            />
            <div class="mt-4 mb-4" v-if="keyHash != ''">
              <div class="text-gray-500 text-sm mb-1 mt-3">PublicKey Hash</div>
              <div>
                <button class="flex" @click="performKeyHashCopy">
                  <div class="text-gray-700">{{ keyHash }}</div>
                  <span class="mt-1 pl-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-files"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div class="text-gray-500 text-sm mb-1 mt-5">StakeKey Hash</div>
              <div>
                <button class="flex" @click="copyToClipboard(stakeKeyHash)">
                  <div class="text-gray-700">{{ stakeKeyHash }}</div> 
                  <span class="pl-2 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-files"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
            <div class="mt-5">
              <button @click="getKeyHash" class="button-old hover:bg-green-600">
                Get Key Hash
              </button>
            </div>
          </div>

          <!-- Script Utilities -->
          <div
            class="flex w-full flex-col items-start"
            v-if="utility == UtilitiesEnums.ScriptHash"
          >
            <div class="mb-5 font-semibold text-gray-500">Enter script json</div>
            <textarea
              class="textarea border border-gray-300 focus:border-gray-400"
              :value="scriptJson"
              @input="onScriptJsonInput"
            />
            <div class="mt-4 mb-4" v-if="policyId != ''">
              <div class="text-gray-500 mb-1">Script policy id</div>
              <div>
                <button class="flex" @click="performPolicyIdCopy">
                  <div>{{ policyId }}</div>
                  <div class="mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      assets
                      height="16"
                      fill="currentColor"
                      class="bi bi-files"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
            <div class="mt-6">
              <button @click="getScriptPolicy" class="button-old hover:bg-green-600">
                Get Policy Id
              </button>
            </div>
          </div>

          <!-- Hex Utility -->
          <div
            class="flex flex-col w-full items-center"
            v-if="utility == UtilitiesEnums.Hex"
          >
            <div class="flex flex-col items-start w-full relative">
              <div class="mb-5 text-gray-500 font-semibold">Raw data</div>
              <textarea
                :value="rawData"
                @input="onHexInput"
                class="p-2 textarea w-full min-h-[200pt] border border-gray-300 focus:border-gray-400"
              />
              <div class="mt-4 mb-4" v-if="result || errorMsg">
                <div v-if="errorMsg" class="text-red-500">
                  {{ errorMsg }}
                </div>
                <div v-else>
                  <div class="text-gray-500 mb-1 text-left">Result</div>
                  <button
                    class="w-full hover:bg-slate-100 py-0.5"
                    @click="copyToClipboard(result)"
                  >
                    <span class="">{{ result }}</span>
                    <span class="mt-1 pr-3 float-right">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        class="bi bi-files"
                        viewBox="0 0 16 16"
                      >
                        <path
                          d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div class="flex w-full items-start justify-start mt-4">
              <button @click="encodeHex" class="button-old hover:bg-green-600">
                Encode
              </button>
              <button @click="decodeHex" class="button-old hover:bg-green-600 ml-3">
                Decode
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- utilites menu -->
      <div
        class="flex flex-col w-utilitiesMenu items-center font-semibold text-gray-600 2xl:text-sm xl:text-sm lg:text-xs justify-start bg-white h-full border border-borderColor"
      >
        <div
          @click="changeUtility(UtilitiesEnums.Address)"
          :class="
            utility == UtilitiesEnums.Address
              ? ' flex h-32 bg-bgSelectedUtility w-full border-b border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
              : 'flex h-32 bg-transparent w-full  border-b border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
          "
        >
          <p class="rotate-90">Address</p>
        </div>

        <div
          @click="changeUtility(UtilitiesEnums.ScriptHash)"
          :class="
            utility == UtilitiesEnums.ScriptHash
              ? ' flex h-32 bg-bgSelectedUtility w-full border-y border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
              : 'flex h-32 bg-transparent w-full border-y border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
          "
        >
          <p class="rotate-90">ScriptHash</p>
        </div>

        <div
          @click="changeUtility(UtilitiesEnums.Hex)"
          :class="
            utility == UtilitiesEnums.Hex
              ? ' flex h-32 bg-bgSelectedUtility w-full border-y border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
              : 'flex h-32 bg-transparent w-full border-y border-borderColor items-center justify-center cursor-pointer hover:bg-gray-100'
          "
        >
          <p class="rotate-90">Hex</p>
        </div>
      </div>
</template>
<script lang="ts">

export default {
  data(){
    return {
      errorMsg: undefined,
      result1: undefined,
      result2: undefined,

    }
  },
  methods: {
      encodeHex() {
      this.errorMsg = "";
      //@ts-ignore
      const encoded = Buffer.from(this.rawData).toString("hex");
      this.result = encoded;
    },
    decodeHex() {
      this.errorMsg = "";
      //@ts-ignore
      let val = this.rawData;
      if (val) {
        const decoded = Buffer.from(val, "hex");
        if (decoded.toString("hex") === val) {
          let result = decoded.toString("utf-8");
          console.log("decoded", result);
          this.result = result;
        } else {
          this.errorMsg = "Invalid input";
        }
      } else {
        this.result = "";
      }
    },
    getKeyHash() {
      // TODO do this with serialization library and not by calling api
      let addr = Address.from_bech32(this.address);
      let addrBase = BaseAddress.from_address(addr);
      let addrPointer = PointerAddress.from_address(addr);
      let addrEnterprise = EnterpriseAddress.from_address(addr);
      let keyHash: Ed25519KeyHash;
      let stakeKeyHash : any;
      if (addrBase) {
        console.log("hashKind", addrBase.payment_cred().kind);
        keyHash = addrBase.payment_cred().to_keyhash() ;
        stakeKeyHash = addrBase.stake_cred().to_keyhash() || addrBase.stake_cred().to_scripthash() 
      } else if (addrPointer) {
        keyHash = addrPointer.payment_cred().to_keyhash();
      } else if (addrEnterprise) {
        keyHash = addrEnterprise.payment_cred().to_keyhash();
      }
      let keyHashHex = Buffer.from(keyHash.to_bytes()).toString("hex");
      if(stakeKeyHash){
        this.stakeKeyHash=Buffer.from(stakeKeyHash.to_bytes()).toString("hex");
      }
      this.keyHash = keyHashHex;

      // getKeyHashOfAddressFromKuber(this.activeApi.url, this.address)
      //   .catch((err) => alert(err))
      //   .then((res) => {
      //     this.keyHash = res.keyHash;
      //   });
    },
    getScriptPolicy() {
      // TODO do this with serialization library and not by calling api
      getPolicyIdOfScriptFromKuber(
        this.activeApi.url || this.apis.mainnet.url,
        this.scriptJson
      )
        .catch((err) => alert(err))
        .then((res: string) => {
          this.policyId = res;
        });
    }
}
}
</script>
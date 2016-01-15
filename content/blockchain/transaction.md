---
title: Cryptonote blockchain explorer | Democats.org
description: 
keywords: 
layout: default
---

<div class="container" ng-controller="TransactionDetailsCtl">
   <noscript></noscript>
   <div class="main-app-container">
         <%= render 'blockchain-header' %>

         <section class="blockchain">
            <div>
               <h1><%= render 'blockchain-links' %><br/>
               <span>{{currency_name | capitalize}}</span><span> transaction </span></h1>

               <div>
                  <table class="table dic">
                     <tbody>
                        <tr>
                           <td><span>Hash</span><a data-hint="Unique fingerprint of the transaction." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
                           <td>{{transaction.txDetails.hash}}</td>
                        </tr>
                        <!--
                        <tr>
                           <td><span>Recieved time (UTC)</span><a data-hint="Time when the transaction was added into transaction pool." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
                           <td><span>{{ transaction.txDetails.receiveTime | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span><span> (</span><span>{{transaction.txDetails.receiveTime | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                        </tr>
                        -->
                        <tr>
                           <td>
                              <span>First confirmation time (UTC)</span>
                              <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                                 <div class="hint__content" style="width:400px;white-space:normal;">Time when the transaction was included into a block. For coinbase transactions it is equal to the block timestamp.</div>
                                 <span>?</span>
                              </a>
                           </td>
                           <td><span>{{transaction.block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss'}}</span><span> (</span><span>{{transaction.block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                        </tr>
                        <tr>
                           <td><span>Fee</span><a data-hint="Money that goes to the miner, who included this transaction into block." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
                           <td>{{transaction.txDetails.fee | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
                        </tr>
                        <tr>
                           <td>Sum of outputs</td>
                           <td>{{transaction.txDetails.amount_out | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
                        </tr>
                        <tr>
                           <td><span> </span><span>Size, bytes</span><a data-hint="Size of the transaction in bytes." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
                           <td>{{transaction.txDetails.size}}</td>
                        </tr>
                        <!--
                        <tr>
                           <td>
                              <span>Extra nonce</span>
                              <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                                 <div class="hint__content" style="width:400px;white-space:normal;">The number that the miner calculates in order to solve the block. Effective only for coinbase transactions (which transfers block reward to the miner).</div>
                                 <span>?</span>
                              </a>
                           </td>
                           <td>b</td>
                        </tr>
                        <tr>
                           <td><span> </span><span>One-time public key</span><a data-hint="Transaction's one-time public key. Please refer to CyptoNote whitepaper for more information." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
                           <td>b87594e6d9b820b0b9b5e88ffe6fe8dcf9b301f300ba0bfd6d15bee07f38c430</td>
                        </tr>
                        -->
                        <tr ng-if="transaction.txDetails.paymentId">
                           <td>
                              <span>Payment ID</span>
                              <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                                 <div class="hint__content" style="width:400px;white-space:normal;">Optional user-defined string. Can be used by anyone to distinguish the transactions easier.</div>
                                 <span>?</span>
                              </a>
                           </td>
                           <td><a href="/blockchain/bcn/paymentid/25616d5a2465d250f1a34258a34caced25e923348aa5cf6b01f534ed82a3f901">{{transaction.txDetails.paymentId}}</a></td>
                        </tr>
                        <tr>
                           <td>
                              <span>Mixin count</span>
                              <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                                 <div class="hint__content" style="width:400px;white-space:normal;">Denotes how many random inputs are mixed within this transactions in order to achieve desired level of anonimity. Mixin count 1 means no additional inputs are mixed in and thus each input can be traced back.</div>
                                 <span>?</span>
                              </a>
                           </td>
                           <td>{{transaction.txDetails.mixin}}</td>
                        </tr>
                     </tbody>
                  </table>
                  <h1>From block</h1>
                  <table class="table dic">
                     <tbody>
                        <tr>
                           <td>Hash</td>
                           <td><a href="/blockchain/block/?name={{currency_name}}&hash={{transaction.block.hash}}">{{transaction.block.hash}}</a></td>
                        </tr>
                        <tr>
                           <td>Height</td>
                           <td>{{transaction.block.height}}</td>
                        </tr>
                        <tr>
                           <td>Timestamp (UTC)</td>
                           <td><span>{{transaction.block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss'}}</span><span> (</span><span>{{transaction.block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                        </tr>
                     </tbody>
                  </table>
                  <h1><span>Inputs</span><span><span>(</span><span>{{transaction.tx.vin.length}}</span><span>)</span></span></h1>
                  <table class="table">
                     <tbody>
                        <tr>
                           <th><span>Amount</span><span><span>(</span><span>{{selected_pool.ticker}}</span><span>)</span></span></th>
                           <th>Image</th>
                           <!--<th>From transaction</th>-->
                           <th>Mixin count</th>
                        </tr>
                       <tr ng-repeat="input in transaction.tx.vin">
                           <td>{{input.value.amount | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
                           <td>{{input.value.k_image}}</td>
                           <!--<td>Untraceable</td>-->
                           <td>{{input.value.key_offsets.length}}</td>
                        </tr>
                     </tbody>
                  </table>
                  <h1><span>Outputs</span><span><span>(</span><span>{{transaction.tx.vout.length}}</span><span>)</span></span></h1>
                  <table class="table">
                     <tbody>
                        <tr>
                           <th>Index</th>
                           <th><span>Amount</span><span> (</span><span>{{selected_pool.ticker}}</span><span>)</span></th>
                           <th>Key</th>
                           <!--<th>Global index</th>-->
                        </tr>
                       <tr ng-repeat="output in transaction.tx.vout">
                           <td>{{$index}}</td>
                           <td>{{output.amount | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction }}</td>
                           <td>{{output.target.data.key}}</td>
                           <!--<td>0</td>-->
                        </tr>
                     </tbody>
                  </table>
               </div>

         </section>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>

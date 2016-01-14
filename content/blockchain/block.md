---
title: Cryptonote blockchain explorer | Democats.org
description: 
keywords: 
layout: default
---

<div class="container" ng-controller="BlockDetailsCtl">
   <noscript></noscript>
   <div class="main-app-container">
      <div class="container">
         <%= render 'blockchain-header' %>

         <section class="blockchain">
            <div>
               <h1><%= render 'blockchain-links' %><br/>
               <span>{{currency_name | capitalize}}</span><span> block </span><small>{{block.hash}}</small></h1>
                     <table class="table dic">
         <tbody>
            <tr>
               <td><span>Height</span><a data-hint="Block index in the chain, counting from zero (i.e. genesis block)." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
               <td><a ng-click="changeBlock(block.prev_hash)" class="page">&lt;</a><span>{{block.height}}</span><a ng-if="block.height != height" ng-click="changeBlock(block.next_hash)" class="page">&gt;</a></td>
            </tr>
            <tr>
               <td>
                  <span>Timestamp (UTC)</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Block timestamp displayed as UTC.<br>The timestamp correctness it up to miner, who mined the block.</div>
                     <span>?</span>
                  </a>
               </td>
               <td><span>{{ block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span><span> (</span><span>{{block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
            </tr>
            <tr>
               <td>
                  <span>Difficulty</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content" style="width:400px;white-space:normal;">Simply, it means how difficult it is to find a solution for the block.<br>More specifically, it`s mathematical expectation for number of hashes someone needs to calculate in order to find a correct nonce value solving the block.<br>Last block difficulty is often considered as current network difficulty.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.difficulty | number}}</td>
            </tr>
            <tr>
               <td>
                  <span>Orphan</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content" style="width:400px;white-space:normal;">True, if the block belongs to an alternative chain.<br>In such case all the transactions, excluding coinbase, are removed from the block back to transaction pool to be included in another block. It means there is no reward for the miner.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.orphan_status ? "yes" : "no"}}</td>
            </tr>
            <tr>
               <td><span>Transactions</span><a data-hint="Number of transactions in the block, including coinbase transaction (which transfers block reward to the miner)." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
               <td>{{block.transactions.length | number}}</td>
            </tr>
            <tr>
               <td>
                  <span>Total transactions size, bytes</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Cumulative size of all transactions in the block, including coinbase.<br>In case it's exceeding 'effective txs median' the reward penalty occurs and therefore miner receives less reward.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.transactionsCumulativeSize | number}}</td>
            </tr>
            <tr>
               <td>
                  <span>Total block size, bytes</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Size of the whole block, i.e. block header plus all transactions.<br>&lt;total&nbsp;block&nbsp;size&gt; = &lt;block&nbsp;header&gt; + &lt;total&nbsp;transactions&nbsp;size&gt;</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.blockSize | number}}</td>
            </tr>
            <tr>
               <td><span>Current txs median, bytes</span><a data-hint="Median value of block total transactions size among last 100 blocks." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
               <td>{{block.sizeMedian | number}}</td>
            </tr>
            <tr>
               <td>
                  <span>Effective txs median, bytes</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Bounded from below median value that is actually used to calculate penalty.<br>More specifically, &lt;effective median&gt; = max(&lt;current median&gt;, 20000)</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.effectiveSizeMedian | number}}</td>
            </tr>
            <tr>
               <td>
                  <span>Reward penalty</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Penalty for exceeding the median.<br>&lt;penalty&gt; = (&lt;total&nbsp;transactions&nbsp;size&gt; / &lt;effective&nbsp;tx&nbsp;median&gt; − 1) ^ 2<br>No penalty if total transactions size is less then effective median.<br>Penalty is near 100% if total txs size is twice the effective median. Greater blocks are not allowed.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.penalty * 100 | number}}%</td>
            </tr>
            <tr>
               <td>
                  <span>Base Reward</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Base value for calculating the block reward. Does not depend on how many transactions are included into the block.<br>Also, this is how many coins the miner would receive if the block contains only coinbase transaction.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.baseReward | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
            </tr>
            <tr>
               <td><span>Transactions fee</span><a data-hint="Sum of fees for all transactions in the block." class="hint--right hint--rounded hint--tooltip circle">?</a></td>
               <td>{{block.totalFeeAmount | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
            </tr>
            <tr>
               <td>
                  <span>Reward</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Actual amount of coins the miner received for finding the block.<br>&lt;reward&gt; = &lt;base reward&gt; × (1 − &lt;penalty&gt;) + &lt;transactions fee&gt;</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.reward | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
            </tr>
            <tr>
               <td>
                  <span>Total coins in the network</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Cumulative amount of coins issued by all the blocks in blockchain from the<br> genesis and up to this block.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.alreadyGeneratedCoins | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
            </tr>
            <tr>
               <td>
                  <span>Total transactions in the network</span>
                  <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                     <div class="hint__content">Cumulative number of transactions in the blockchain, from the<br> genesis block and up to this block.</div>
                     <span>?</span>
                  </a>
               </td>
               <td>{{block.alreadyGeneratedTransactions | number}}</td>
            </tr>
         </tbody>
      </table>
      <h1>Transactions</h1>
      <table class="table transactions">
         <thead>
            <tr>
               <th>Hash</th>
               <th><span>Fee</span><span> (</span><span>{{selected_pool.ticker}}</span><span>)</span></th>
               <th><span>Total amount</span><span> (</span><span>{{selected_pool.ticker}}</span><span>)</span></th>
               <th>Size</th>
            </tr>
         </thead>
         <tbody>
            <tr ng-repeat="transaction in block.transactions">
               <td><a href="/blockchain/transaction/?name={{currency_name}}&hash={{transaction.hash}}">{{transaction.hash}}</a></td>
               <td>{{transaction.fee | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
               <td>{{transaction.amount_out | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</td>
               <td>{{transaction.size}}</td>
            </tr>
         </tbody>
      </table>
         </section>
      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>

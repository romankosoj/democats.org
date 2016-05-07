---
title: Cryptonote blockchain explorer | Democats.org
description: 
keywords: 
layout: default
---

<div ng-controller="BlocksListCtl">
   <%= render 'pool-header' %>

<div class="container">
   <noscript></noscript>

   
   <div class="main-app-container">

         <section class="blockchain">
            <div>
               <%= render 'blockchain-header' %>
               <h1>
               <span><span>{{currency_name | capitalize}}</span><span> </span><span>blockchain</span></span></h1>
               <div>
                  <ul class="pager">
                     <li class="previous" ng-if="prev_block_1 != prev_block_2"><a ng-click="changeHeight(prev_block_2)"><span class="arrow-left">&lt;</span> <span>{{prev_block_1}}</span><span> - </span><span>{{prev_block_2}}</span></a></li>
                     <li class="next" ng-if="next_block_1 != next_block_2"><a ng-click="changeHeight(next_block_2)"><span>{{next_block_1}}</span><span> - </span><span>{{next_block_2}}</span> <span class="arrow-right">&gt;</span></a></li>
                  </ul>
                  <table class="table">
                     <thead>
                        <tr>
                           <th>Height</th>
                           <th>Timestamp (UTC)</th>
                           <th class="text-center">Size</th>
                           <th class="text-center">Transactions</th>
                           <th>Hash</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr ng-repeat="block in blocks">
                           <td><a target="_self" href="/blockchain/block/?name={{currency_name}}&hash={{block.hash}}">{{block.height}}</a></td>
                           <td><span><span>{{ block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span></span><span> (</span><span>{{block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                           <td class="text-center">{{block.cumul_size}}</td>
                           <td class="text-center">{{block.tx_count}}</td>
                           <td><a target="_self" href="/blockchain/block/?name={{currency_name}}&hash={{block.hash}}">{{block.hash}}</a></td>
                        </tr>
                     </tbody>
                  </table>
                  <ul class="pager">
                     <li class="previous" ng-if="prev_block_1 != prev_block_2"><a ng-click="changeHeight(prev_block_2)"><span class="arrow-left">&lt;</span> <span>{{prev_block_1}}</span><span> - </span><span>{{prev_block_2}}</span></a></li>
                     <li class="next" ng-if="next_block_1 != next_block_2"><a ng-click="changeHeight(next_block_2)"><span>{{next_block_1}}</span><span> - </span><span>{{next_block_2}}</span> <span class="arrow-right">&gt;</span></a></li>
                  </ul>
               </div>
            </div>
         </section>
   </div>
</div>

</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>


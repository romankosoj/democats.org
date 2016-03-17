---
title: Cryptonote pool blocks | Democats.org
description: 
keywords: 
layout: default
---

<div class="container" ng-controller="PoolBlocksCtl">
   <noscript></noscript>
   <div class="main-app-container">
      <div class="container">
         <%= render 'blockchain-links' %>
         <section class="blockchain">
            <div>
               <%= render 'pool-blocks-header' %>

               <h1><span><span>{{currency_name | capitalize}}</span><span> </span><span>pool blocks</span></span></h1>
               <div>
                  <table class="table">
                     <thead>
                        <tr>
                           <th>Height</th>
                           <th>Timestamp (UTC)</th>
                           <th class="text-center">Status</th>
                           <th>Hash</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr ng-repeat="block in blocks" ng-class="{success: block.status == 'unlocked', error: block.status == 'orphaned'}">
                           <td><a href="/blockchain/block/?name={{currency_name}}&hash={{block.hash}}">{{block.height}}</a></td>
                           <td><span><span>{{ block.timestamp | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span></span><span> (</span><span>{{block.timestamp | amFromUnix | amUtc | timeAgo}}</span><span>)</span></td>
                           <td class="text-center">{{block.status | capitalize}}</td>
                           <td><a href="/blockchain/block/?name={{currency_name}}&hash={{block.hash}}">{{block.hash}}</a></td>
                        </tr>
                     </tbody>
                  </table>
                  <ul class="pager">
                     <li class="previous"><a ng-click="getBlocks(last_printed_block)"><span>Show more</span></a></li>
                  </ul>
               </div>
            </div>
         </section>
      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>


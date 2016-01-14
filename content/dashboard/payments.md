---
title: Payments | Democats.org
description: 
keywords: 
layout: default
---


<div class="container" ng-controller="DashboardPaymentsCtl">

<div>
   <div class="subheader"><a class="" href="/dashboard/">Dashboard</a><a class="active" href="/dashboard/payments/?currency={{currency_name}}&address={{address}}">Payment history</a></div>
   <div class="row">
      <div class="col-xs-12">
         <div class="transactions-panel">
            <h1>{{currency_name}} payment history</h1>
            <div>
               <table class="table">
                  <tbody>
                     <tr>
                        <th><span>Date</span></th>
                        <th>Transaction hash</th>
                        <th>Sum</th>
                        <th>Fee</th>
                     </tr>
                     <tr class="my-repeat-animation" ng-repeat="payment in payments">
                        <td class="green"><span><span>{{payment.time | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span></span><span> (</span><span>{{payment.time | amFromUnix | amUtc | timeAgo}}</span><span>)</span>
                        </td>
                        <td>
                           <p><a href="/blockchain/transaction/?name={{currency_name}}&hash={{payment.hash}}">{{payment.hash}}</a></p>
                        </td>
                        <td>
                           <p class="amount">{{payment.amount | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</p>
                        </td>
                        <td>
                            <p><span>{{payment.fee | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</span></p>
                        </td>
                     </tr>
                  </tbody>
               </table>
                <ul class="pager">
                    <li class="previous"><a ng-click="getPayments(last_printed_payment)"><span>Show more</span></a></li>
                </ul>

            </div>
         </div>
      </div>
   </div>
</div>

</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>

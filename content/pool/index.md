---
title: Cryptonote pool | Democats.org
description: 
keywords: 
layout: default
---
<div ng-controller="PoolIndexCtl">
   <%= render 'pool-header' %>
   <div class="container">
      <noscript></noscript>
      <h1><span><span>{{currency_name | capitalize}}</span><span> </span><span>pool</span></span></h1>
      <div class="row">
         <div class="col-lg-8">
            <section class="blockchain">
               <div class="row">
                  <div class="col-md-6 stats">
                     <h5>Network</h5>
                     <table class="table">
                        <tr>
                           <td>Hash Rate:</td>
                           <td><b>{{selected_pool_stats.world_hashrate|hashrateValue}} {{selected_pool_stats.world_hashrate|hashrateUnits}}/s</b></td>
                        </tr>
                        <tr>
                           <td>Block Found:</td>
                           <td><b>{{ data.network.timestamp | amFromUnix | amUtc | timeAgo }}</b></td>
                        </tr>
                        <tr>
                           <td>Difficulty:</td>
                           <td><b>{{data.network.difficulty}}</b></td>
                        </tr>
                        <tr>
                           <td>Blockchain Height:</td>
                           <td><b>{{ data.network.height }}</b></td>
                        </tr>
                        <tr>
                           <td>Last Reward:</td>
                           <td><b>{{data.network.reward | asCoinUnits:selected_pool_stats.coin_units | number: 4}} {{selected_pool.ticker}}</b></td>
                        </tr>
                        <tr>
                           <td>Last Hash:</td>
                           <td><a target="_self" href="/blockchain/block/?name={{currency_name}}&hash={{ data.network.hash }}">{{ data.network.hash | limitTo: 10 }}...</a></td>
                        </tr>
                     </table>
                  </div>
                  <div class="col-md-6 stats">
                     <h5>Our Pool</h5>
                     <table class="table">
                        <tr>
                           <td>Hash Rate:</td>
                           <td><b>{{selected_pool_stats.pool_hashrate|hashrateValue}} {{selected_pool_stats.pool_hashrate|hashrateUnits}}/s</b></td>
                        </tr>
                        <tr>
                           <td>Block Found:</td>
                           <td><b>{{ data.pool.lastBlockFound/1000 | amFromUnix | amUtc | timeAgo }}</b></td>
                        </tr>
                        <tr>
                           <td>Connected Miners:</td>
                           <td><b>{{selected_pool_stats.workers}}</b></td>
                        </tr>
                        <tr>
                           <td>Minimal payment:</td>
                           <td><b>{{selected_pool_stats.min_payment_threshold | asCoinUnits:selected_pool_stats.coin_units | number: 4}} {{selected_pool.ticker}}</b></td>
                        </tr>
                        <tr>
                           <td>Total Pool Fee:</td>
                           <td><b>{{selected_pool_stats.fee}}%</b></td>
                        </tr>

            <div ng-show="currency_name == 'karbowanec'>
                        <tr>
                           <td>Donation to Core:</td>
                           <td><b>3.5%</b></td>
                        </tr>
            </div>

                        <tr>
                           <td>Block Found Every:</td>
                           <td><b>{{(current_date/1000 - (data.network.difficulty / data.pool.hashrate) | amFromUnix | amUtc | timeAgo).slice(0,-4)}} (est.)</b></td>
                        </tr>
                     </table>
                  </div>
               </div>
               <hr>
               <div class="row chartsPoolStat">
                  <div class="col-sm-3 chartWrap">
                      <highchart id="chart1" config="chartDifficultyConfig" class="span6"></highchart>
                  </div>
                  <div class="col-sm-3 chartWrap">
                      <highchart id="chart1" config="chartHashrateConfig" class="span6"></highchart>
                  </div>
                  <div class="col-sm-3 chartWrap" ng-if="chartPriceUSDConfig">
                      <highchart id="chart1" config="chartPriceUSDConfig" class="span6"></highchart>
                  </div>
                  <div class="col-sm-3 chartWrap" ng-if="chartHashUSDConfig">
                      <highchart id="chart1" config="chartHashUSDConfig" class="span6"></highchart>
                  </div>
               </div>
               <!-- <hr> -->
               <hr>
               <h5>Your Stats & Payment History</h5>
                <div class="stats">
                  <div class="input-group">
                     <input class="form-control" id="yourStatsInput" type="text" ng-model="newAddress" placeholder="Enter Your Address">
                     <span class="input-group-btn"><button class="btn btn-default" type="button" id="lookUp" ng-click="addAddress()">
                     <span><i class="fa fa-search"></i> Lookup</span>
                     </button></span>
                  </div>
                  <div id="addressStatus">{{addressStatus}}</div>
               </div>
               <div class="stats" ng-repeat="address in addresses_currency" inner-var="address_index = $index">
               <hr>
                  <div class="row">
                     <div class="col-md-12 stats">

                         <div class="row">
                            <div class="col-sm-11"><b>{{address.address | limitTo: 40}}...</b></div>
                            <div class="col-sm-1"><a href="" ng-click="removeAddress(addresses_stats[address_index].real_index)" class="marketFooter">Remove</a></div>
                         </div>
                     </div>
                  </div>
                  <div class="row">
                     <div class="col-sm-6 stats">

                         <table class="table">
                            <tr>
                                <td>Pending Balance:</td>
                                <td><b>{{addresses_stats[address_index].stats.balance | asCoinUnits:selected_pool_stats.coin_units | number: 4}} {{selected_pool.ticker}}</b></td>
                            </tr>
                            <tr>
                                <td>Total Paid:</td>
                                <td><b>{{addresses_stats[address_index].stats.paid | asCoinUnits:selected_pool_stats.coin_units | number: 4}} {{selected_pool.ticker}}</b></td>
                            </tr>
                            <tr>
                                <td>Last Share Submitted:</td>
                                <td><b>{{ addresses_stats[address_index].stats.lastShare | amFromUnix | amUtc | timeAgo }}</b></td>
                            </tr>
                            <tr>
                                <td>Hash Rate:</td>
                                <td><b>{{ addresses_stats[address_index].stats.hashrate || "0H"}}/s</b></td>
                            </tr>
                            <tr>
                                <td>Total Hashes Submitted:</td>
                                <td><b>{{addresses_stats[address_index].stats.hashes}} </b></td>
                            </tr>
                         </table>
                     </div>
                     <div class="col-sm-3">
                        <div class="userChart" data-chart="user_hashrate">
                           <highchart id="chart1" config="addresses_stats[address_index].configCharts.hashrate" class="span6"></highchart>
                        </div>
                     </div>
                     <div class="col-sm-3">
                        <div class="userChart" data-chart="user_payments">
                           <highchart id="chart1" config="addresses_stats[address_index].configCharts.payments" class="span6"></highchart>
                        </div>
                     </div>
                  </div>
                   <div class="row">
                      <div class="col-xs-12">
                               <table class="table" ng-if="addresses_stats[address_index].paymentsList.length">
                                  <tbody>
                                     <tr>
                                        <th>Payment date</th>
                                        <th>Transaction hash</th>
                                        <th>Sum</th>
                                     </tr>
                                     <tr class="my-repeat-animation small-85" ng-repeat="payment in addresses_stats[address_index].paymentsList">
                                        <td class="green"><span><span>{{payment.time | amFromUnix | amUtc | amDateFormat:'YYYY-MM-DD HH:mm:ss' }}</span></span><span> (</span><span>{{payment.time | amFromUnix | amUtc | timeAgo}}</span><span>)</span>
                                        </td>
                                        <td>
                                           <p><a href="/blockchain/transaction/?name={{currency_name}}&hash={{payment.hash}}" target="_self">{{payment.hash}}</a></p>
                                        </td>
                                        <td>
                                           <p class="amount">{{payment.amount | asCoinUnits:selected_pool_stats.coin_units | number: coin_unit_fraction}}</p>
                                        </td>
                                     </tr>
                                  </tbody>
                               </table>
                                <ul class="pager">
                                    <li><a href="" ng-click="getPayments(addresses_stats[address_index].last_printed_payment, address_index)"><span>{{ addresses_stats[address_index].paymentsList.length ? 'Load more' : 'Show payment history' }}</span></a></li>
                                </ul>
                      </div>
                   </div>
               </div>
            </section>
         </div>
         <div class="col-lg-4 grey">
            <div class="my-mining" ng-if="cryptonator_data.BTC || cryptonator_data.USD">
               <h5 id="marketHeader">Market</h5>
               <table class="table">
                  <tr ng-if="cryptonator_data.BTC">
                     <td>{{selected_pool.ticker}}:</td>
                     <td>{{cryptonator_data.BTC}} BTC</td>
                  </tr>
                  <tr ng-if="cryptonator_data.USD">
                     <td>{{selected_pool.ticker}}:</td>
                     <td>{{cryptonator_data.USD}} USD</td>
                  </tr>
                  <tr ng-if="cryptonator_data.USD">
                     <td>Hash/USD:</td>
                     <td>{{hashPerUSD}}</td>
                  </tr>
               </table>
               <div class="marketFooter">Updated: {{cryptonator_updated | amFromUnix | amUtc | timeAgo}}</div>
               <div class="marketFooter">Powered by <a href="https://www.cryptonator.com/">Cryptonator</a></div>
               <hr>
            </div>
            <div id="miningProfitCalc">

               <h5 id="marketHeader" ng-if="!(cryptonator_data.BTC || cryptonator_data.USD)"></h5>
               <div id="calcHashHolder">
                  <div class="input-group">
                     <input type="number" class="form-control" placeholder="Enter Your Hash Rate" ng-model="calcHashRate" ng-change="calcEstimateProfit()">
                     <div class="input-group-btn">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" id="calcHashDropdown">
                        <span id="calcHashUnit" value="1">{{calcUnitName}}/s</span> <span class="caret"></span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-right" role="menu" id="calcHashUnits" ng-click="calcEstimateProfit()">
                           <li><a href="#" value="0" ng-click="setCalcUnits(0, 'H')">H/s</a></li>
                           <li><a href="#" value="1" ng-click="setCalcUnits(1, 'KH')">KH/s</a></li>
                           <li><a href="#" value="2" ng-click="setCalcUnits(2, 'MH')">MH/s</a></li>
                        </ul>
                     </div>
                     <span class="input-group-addon">=</span>
                     <span class="input-group-addon" id="calcHashResultsHolder">{{calcProfit | asCoinUnits:selected_pool_stats.coin_units | number: 4}} {{selected_pool.ticker}}/day</span>
                  </div>
               </div>
               <hr>
            </div>
            <h5>{{selected_pool.name}} Chat</h5>
            <iframe ng-src="{{chatURL}}" style="border:0; width:100%; height:500px;"></iframe>
         </div>
      </div>
   </div>
</div>
<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>
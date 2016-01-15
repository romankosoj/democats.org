---
title: Dashboard | Democats.org
description: 
keywords: 
layout: default
---


<div class="container" ng-controller="DashboardCtl">
   <noscript></noscript>
   <div>
      <div class="center-tpl">
         <div class="row">
            <div class="col-xs-12">
               <h4 class="mine-title"><span class=""></span><span>Track address</span></h4>
            </div>

  <div class="col-xs-10" style="margin-bottom:40px">
    <div class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{selected_pool.name | capitalize}} <span class="caret"></span></button>
        <ul class="dropdown-menu dropdown-menu-right">
          <li ng-repeat="pool in pools | orderBy: 'name'"><a ng-click="changePool(pool)">{{pool.name}}</a></li>
        </ul>
      </div><!-- /btn-group -->
      <input type="text" class="form-control" aria-label="Address..." ng-model="newAddress">
      <span class="input-group-btn">
        <button class="btn btn-primary" type="button" ng-click="addAddress()">Track!</button>
      </span>
    </div><!-- /input-group -->
  </div><!-- /.col-lg-10 -->

         </div>
         <div class="row" ng-repeat="address in addresses" inner-var="address_index = $index">
            <div class="col-xs-12">
               <h4 class="mine-title">
                  <span class="balanceFloat">{{address.address}}</span>
                  <div class="options pull-right">
                    <span data-hint="remove" class="hint--top hint--rounded hint--tooltip"><a class="panel-icon panel-icon-hide" ng-click="removeAddress($index)"></a></span>
                    <span data-hint="move up" class="hint--top hint--rounded hint--tooltip" ng-hide="$first" ng-click="moveUpAddress($index)"><a class="panel-icon panel-icon-up"></a></span>
                    <span data-hint="move down" class="hint--top hint--rounded hint--tooltip" ng-hide="$last" ng-click="moveDownAddress($index)"><a class="panel-icon panel-icon-down"></a></span>
                    <a href="/dashboard/payments/?currency={{address.currency}}&address={{address.address}}" class="panel-link">Payments history</a></div>
               </h4>
               <div class="mining-panel" ng-class="{success: addresses_stats[address_index].stats.hashrate}" nsuccess ng-repeat="currency in currencies | filter: address.currency">
                  <div class="row">
                    <div class="col-xs-6">
                        <div class="mining-block">
                           <h2>
                              <span>{{address.currency}}</span><span class="speed" ng-show="addresses_stats[address_index].stats.hashrate" ng-repeat-start="item in addresses_stats[address_index].stats.hashrate.split(' ')" ng-if="!$last">{{item}}</span><small ng-repeat-end ng-if="$last">{{item}}/s</small>
                              <div class="data status-data"><span>Status:</span><b>{{addresses_stats[address_index].stats.hashrate ? "ONLINE" : "OFFLINE"}}</b></div>
                           </h2>

                           <div class="data">
                              <div class="subdata"><span>Unconfirmed:</span><b>{{addresses_stats[address_index].stats.balance | asCoinUnits:currency.coin_units | number: coin_unit_fraction}}</b><br><span>Total mined:</span><b>{{addresses_stats[address_index].stats.paid | asCoinUnits:currency.coin_units | number: coin_unit_fraction}}</b></div>
                              <div class="subdata"><span>Good hashes:</span><b>{{addresses_stats[address_index].stats.hashes | number}}</b><br><span>Bad hashes:</span><b>0</b><br></div>
                              <div class="subdata">
                              <span>Last submitted hash:</span><b>{{addresses_stats[address_index].stats.lastShare | amFromUnix | amUtc | timeAgo}}</b><br>
                                 <span class="muted">
                                    <span>Invalid hashes:</span><b>0</b>
                                    <a class="hint hint--html hint--right hint--rounded hint--tooltip circle">
                                       <div class="hint__content" style="width:400px;white-space:normal;">This number shows the number of invalid shares submitted by you. For each invalid share you get penalty and your unconfirmed balance decreases. If you use good miner app and are not trying to cheat the pool, the chances of submitting invalid share are extremely low.</div>
                                       <span>?</span>
                                    </a>
                                 </span>
                              </div>
                              <br><small>Your coins will be send when the block is confirmed</small>
                           </div>
                        </div>
                     </div>
                     <div class="col-xs-3">
                        <div class="mining-block left-border">
                           <h2><span>Pool</span><span class="speed">{{currency.pool_hashrate|hashrateValue}}</span><small>{{currency.pool_hashrate|hashrateUnits}}/s</small></h2>
                           <div class="data"><span><span>Miners</span><span>:</span></span><b>{{currency.workers}}</b></div>
                           <div class="data"><span><span>Fee</span><span>:</span></span><b>{{currency.fee}}%</b></div>
                        </div>
                     </div>
                     <div class="col-xs-3">
                        <div class="mining-block left-border">
                           <h2><span>World</span><span class="speed">{{currency.world_hashrate|hashrateValue}}</span><small>{{currency.world_hashrate|hashrateUnits}}/s</small></h2>
                           <div class="data"><span><span>Blockchain height</span><span>:</span></span><b>{{currency.height | number}}</b></div>
                           <div class="data"><span><span>Difficulty</span><span>:</span></span><b>{{currency.difficulty | number}}</b></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="row">
            <div class="col-xs-12 hidden-block"></div>
         </div>
      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>

---
title: Cryptonote pool for Forknote compatible currencies. Bytecoin, Dashcoin, Magnatoj pool | Democats.org
description:
keywords:
layout: default
---

<div class="container" ng-controller="MainCtl">
   <div class="row">
     <div class="col-xs-12">
        <h1>Cryptonote pool for Forknote compatible currencies</h1>
     </div>
   </div>
   <div class="row">
      <div class="col-md-8 topmargin">
          <div class="currencies">
            <h5>Supported currencies </h5>
            <table class="table">
               <thead>
                  <tr>
                     <th>Currency</th>
                     <th>Pool</th>
                     <th>World</th>
                     <th>Fee</th>
                     <th>Workers</th>
                  </tr>
               </thead>
               <tbody>
                  <tr ng-repeat="cc in currencies | orderBy: ['-pool_hashrate', '-world_hashrate']">
                     <td class="name"><a href="/pool-blocks/?name={{cc.currency|lowercase}}"><div class="icons {{cc.currency}}"></div><span>{{cc.currency | capitalize}}</span></a></td>
                     <td class="pool">{{cc.pool_hashrate|hashrateValue}} <small>{{cc.pool_hashrate|hashrateUnits}}/s</small></td>
                     <td class="world">{{cc.world_hashrate|hashrateValue}} <small>{{cc.world_hashrate|hashrateUnits}}/s</small></td>
                     <td class="feeRate">{{cc.fee}} %</td>
                     <td class="workers">{{cc.workers}}</td>
                  </tr>
               </tbody>
            </table>
         </div>

          <div class="alternate-miners">
             <h5>Supported cryptonote miners</h5>
             <table class="table">
                <thead>
                   <tr>
                      <th>Miner</th>
                      <th>Discussion</th>
                      <th>Download</th>
                      <th>
                         <span><span>Currency</span><sup>*</sup></span>
                         <div class="currency-helper">
                            <div class="btn-group rates">
                               <button class="btn dropdown-toggle" data-toggle="dropdown" tabindex="0"><span>{{selected_pool.ticker}}</span><span class="caret"></span></button>
                               <ul class="dropdown-menu" role="menu">
                                  <li ng-repeat="pool in pools | orderBy: 'name'"><a class="dropdown-menu__entry" ng-click="changeExamplePool(pool)">{{pool.name}}</a></li>
                               </ul>
                            </div>
                         </div>
                      </th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td><b>Claymore CryptoNote GPU</b><span>(</span><span>Windows x64, Linux x64</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=638915.0" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://mega.co.nz/#F!e4JVEAIJ!l1iF4z10fMyJzY5-LnyC2A" target="_blank">mega.co.nz</a></td>
                      <td></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>NsGpuCNMiner64 -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>Claymore CryptoNote CPU</b><span>(</span><span>Windows</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=647251.0" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://mega.co.nz/#F!Hg4g1bLT!4Upg8GNiEZYCaZ04XVh_yg" target="_blank">mega.co.nz</a></td>
                      <td></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>NsCpuCNMiner64 -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>ccminer-cryptonight</b><span>(</span><span>Windows, Linux</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=656841.msg7487737#msg7487737" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://github.com/tsiv/ccminer-cryptonight" target="_blank">github.com</a></td>
                      <td></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>ccminer -a cryptonight -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>CPUMiner-Multi</b><span>(</span><span>Windows, Linux, Unix</span><span>)</span></td>
                      <td><a href="https://bitcointalk.org/index.php?topic=632724" target="_blank">BitcoinTalk</a></td>
                      <td><a href="https://ottrbutt.com/cpuminer-multi/" target="_blank">ottrbutt.com</a></td>
                      <td></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>minerd -a cryptonight -o stratum+tcp://{{selected_pool.poolmining}} -u WALLET_ADDRESS -p x</code></td>
                   </tr>
                </tbody>
                <tbody>
                   <tr>
                      <td><b>Yam</b><span>(</span><span>Windows x64, Linux x64, MacOS x64, FreeBSD x64</span><span>)</span></td>
                      <td><a href="https://twitter.com/yvg1900" target="_blank">Twitter</a></td>
                      <td><a href="https://mega.co.nz/#F!UlkU0RyR!E8n4CFkqVu0WoOnsJnQkSg" target="_blank">mega.co.nz</a></td>
                      <td></td>
                   </tr>
                   <tr>
                      <td colspan="4"><span class="muted">Example:</span><code>yam -c x -M stratum+tcp://WALLET_ADDRESS:x@{{selected_pool.poolmining}}</code></td>
                   </tr>
                </tbody>
             </table>
             <small><span>* Change to update the examples </span></small>
          </div>


      </div>
      <div class="col-md-4 right-paddingless col-eq-height right-cell main-page__right-column"></div>
   </div>
</div>
<!-- /.container -->

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>
